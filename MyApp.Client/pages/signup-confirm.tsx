import Page from "@/components/layout-page"
import { useRouter } from "next/router"

export default () => {
    const router = useRouter()
    const confirmLink = router.query.confirmLink as string | undefined

    return (<Page title="Signup confirmation">
        <div className="mt-8 mb-20">
            {!confirmLink ? null :
                <p className="my-4">
                    Normally this would be emailed:
                    <a className="pl-2 font-semibold" id="confirm-link" href={confirmLink}>
                        Click here to confirm your account
                    </a>
                </p>}
            <p className="my-4">Please check your email to confirm your account.</p>
        </div>
    </Page>)
}
