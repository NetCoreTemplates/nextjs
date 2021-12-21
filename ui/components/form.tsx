import Link from "next/link"
import { Icon } from "@iconify/react"
import { ErrorResponse, errorResponse, errorResponseExcept, ResponseStatus, humanize, toPascalCase } from "@servicestack/client"
import React, { createContext, FC, SyntheticEvent, useContext, useEffect, useState } from "react"
import Router, { NextRouter, useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"

import useAuth, { AuthenticatedContext } from "../lib/useAuth"
import { Routes } from "../lib/gateway"
import classNames from "classnames";
import { ST } from "next/dist/shared/lib/utils";

export function getRedirect(query?:ParsedUrlQuery) {    
    let { redirect } = (query ?? Router.query)
    return redirect && Array.isArray(redirect)
        ? redirect[0]
        : redirect
}

const humanLabel = (s:string) => humanize(toPascalCase(s))

export const Redirecting : FC<any> = (props) => {
    return <Loading className="py-2 pl-4" text="redirecting ..." />
}

type ValidateAuthProps = {
    role?: string
    permission?: string
    redirectTo?: string
}
export function ValidateAuth<TOriginalProps extends {}>(Component:React.FC<TOriginalProps>, validateProps? :ValidateAuthProps) {
    let { role, permission, redirectTo } = validateProps ?? {}
    const compWithProps: React.FC<TOriginalProps & AuthenticatedContext> = (props) => {
        const authProps = useAuth()
        const { auth, signedIn, hasRole } = authProps
        redirectTo ??= useRouter().pathname

        const shouldRedirect = () => !signedIn
            ? Routes.signin(redirectTo)
            : role && !hasRole(role)
                ? Routes.forbidden()
                : permission && !hasRole(permission)
                    ? Routes.forbidden()
                    : null;

        useEffect(() => {
            const goTo = shouldRedirect()
            if (goTo) {
                Router.replace(goTo)
            }
        }, [auth])

        if (shouldRedirect()) {
            return <Redirecting />
        }
        
        return <Component {...authProps} {...props} />
    }
    
    return compWithProps
}

type FormState = {
    responseStatus?: ErrorResponse
    didSubmit: boolean
    loading: boolean
}
export const FormContext = createContext<FormState>({ loading: false, didSubmit:false })
export type SuccessContext<T> = { response?:T, router:NextRouter }
export type SuccessEventHandler<T> = (ctx:SuccessContext<T>) => Promise<any> | void;

FormContext.Consumer

type FormProps = {
    className?: string
    method?: string
    onSubmit: (e:SyntheticEvent<HTMLFormElement>) => Promise<any>|void
    onSuccess?: SuccessEventHandler<any>
    children: React.ReactNode
}
export const Form: FC<FormProps> = (props) => {
    const { className, method, onSubmit, onSuccess, children, ...remaining } = props
    const [responseStatus, setResponseStatus] = useState<ErrorResponse|undefined>()
    const [loading, setLoading] = useState(false)
    const [didSubmit, setDidSubmit] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e:SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        setDidSubmit(true)

        if (onSubmit) {
            setLoading(true)
            try {
                setResponseStatus(undefined)

                let response = await onSubmit(e)
                if (onSuccess) {
                    onSuccess({ response, router })
                }
            } catch (e:any) {
                setResponseStatus(e.responseStatus ?? e)
            } finally {
                setLoading(false)
            }
        }
    }
    return (<FormContext.Provider value={{ loading, responseStatus, didSubmit }}>
        <form method={method ?? 'POST'} className={className} onSubmit={handleSubmit} {...remaining}>{children}</form>
    </FormContext.Provider>)
}

type ErrorSummaryProps = {
    except: string | string[]
}
export const ErrorSummary: FC<ErrorSummaryProps> = ({ except }) => {
    const ctx = useContext(FormContext);
    const status = ctx?.responseStatus;
    const errorSummary = status ? errorResponseExcept.call(ctx,except) : null;
    if (!errorSummary) return null;

    return (<div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
            <div className="flex-shrink-0">
                <Icon icon="mdi:close-circle" className="h-5 w-5 text-red-500" aria-hidden="true" />
            </div>
            <div className="ml-3">
                <p className="text-sm text-red-700">{errorSummary}</p>
            </div>
        </div>
    </div>)
};

type InputProps = {
    status?: ResponseStatus
    id: string
    type?: string
    className?: string
    placeholder?: string
    help?: string
    label?: string
} | any
export const Input: FC<InputProps> = ({ status, id, type, className, placeholder, help, label, ...remaining }) => {
    
    const useType = type ?? 'text'
    const useLabel = label ?? humanLabel(id)
    const usePlaceholder = placeholder ?? useLabel
    const useHelp = help ?? ''
    
    const ctx = new ErrorResponse({ 
        responseStatus: status ?? useContext(FormContext)?.responseStatus 
    })
    const errorField = id && ctx.responseStatus && errorResponse.call(ctx,id)
    const hasErrorField = errorField != null
    
    const cssClass = (validCls?:string, invalidCls?:string) => [!hasErrorField ? validCls : invalidCls, className]

    if (!errorField && useHelp) {
        remaining['aria-describedby'] = `${id}-description`
    }
    
    return (<div>
        {!useLabel ? null : <label htmlFor={id} className="block text-sm font-medium text-gray-700">{useLabel}</label>}
        <div className="mt-1 relative rounded-md shadow-sm">
          <input type={useType} className={classNames(['block w-full sm:text-sm rounded-md', ...cssClass(
            'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300',
          'pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500')])}
            id={id} name={id} placeholder={usePlaceholder} {...remaining} />
        {!hasErrorField ? null : <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {/*Heroicon name: solid/exclamation-circle*/}
            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>}
        </div>
        {hasErrorField 
            ? <p className="mt-2 text-sm text-red-500" id={`${id}-error`}>{errorField}</p>
            : useHelp
                ? <p id={`${id}-description`} className="text-gray-500">{useHelp}</p> : null}
      </div>)
}

type CheckboxProps = {
    status?: ResponseStatus
    id: string
    label: string
    help?: string
} | any
export const Checkbox: FC<CheckboxProps> = ({ status, id, label, help, ...remaining }) => {

    const useLabel = label ?? humanLabel(id)

    const ctx = new ErrorResponse({
        responseStatus: status ?? useContext(FormContext)?.responseStatus
    })
    const errorField = id && ctx.responseStatus && errorResponse.call(ctx,id)
    const hasErrorField = errorField != null

    return (<div className="relative flex items-start">
        <div className="flex items-center h-5">
            <input
                id={id}
                name={id}
                type="checkbox"
                value="true"
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                {...remaining} />
        </div>
        <div className="ml-3 text-sm">
            <label htmlFor={id} className="font-medium text-gray-700 select-none">{useLabel}</label>
            {hasErrorField 
                ? <p className="mt-2 text-sm text-red-500" id="`${id}-error`">{errorField}</p>
                : help 
                    ? <p className="mt-2 text-sm text-gray-500" id="`${id}-description`">{help}</p>
                    : null}
        </div>
    </div>)
}

type ButtonProps = {
    type?: string
    className?: string
    href?: string
    children: React.ReactNode
} | any;
export const PrimaryButton: FC<ButtonProps> = (props) => {
    const { type, className, href, children, ...remaining } = props;
    let cls = ["inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",className].join(' ');
    return href
        ? <Link href={href}><a className={cls} {...remaining}>{children}</a></Link>
        : <button type={type ?? "submit"} className={cls} {...remaining}>{children}</button>
}
export const Button: FC<ButtonProps> = (props) => {
    const { type, className, href, children, ...remaining } = props;
    let cls = ["bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",className].join(' ');
    return href
        ? <Link href={href}><a className={cls} {...remaining}>{children}</a></Link>
        : <button type={type ?? "submit"} className={cls} {...remaining}>{children}</button>
}

type LoadingProps = {
    className?: string
    icon?: boolean
    text?: string
}
export const FormLoading: FC<LoadingProps> = (props) => {
    const ctx = useContext(FormContext)
    if (!ctx.loading) return null
    return Loading(props)
}

export const Loading : FC<LoadingProps> = ({ className, icon, text }) => {
    const showIcon = icon || icon === undefined;
    const showText = text === undefined ? "loading..." : text;
    let cls = ["flex", className];

    return (<div className={cls.join(' ')} title="loading...">
    {showIcon ? (<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24px" height="30px" viewBox="0 0 24 30">
      <rect x="0" y="10" width="4" height="10" fill="#333" opacity="0.2">
        <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0s" dur="0.6s" repeatCount="indefinite" />
        <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
        <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
      </rect>
      <rect x="8" y="10" width="4" height="10" fill="#333"  opacity="0.2">
        <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
        <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
        <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
      </rect>
      <rect x="16" y="10" width="4" height="10" fill="#333"  opacity="0.2">
        <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
        <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
        <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
      </rect>
    </svg>) : null}
    <span className="ml-1 text-gray-400">{showText}</span>
  </div>)
}