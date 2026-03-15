class ENV {
    public static BASE_URL = process.env.BASE_URL
    public static AEM_AUTHOR_URL = process.env.AEM_AUTHOR_URL
    public static AEM_AUTHOR_USERNAME = process.env.AEM_AUTHOR_USERNAME
    public static AEM_AUTHOR_PASSWORD = process.env.AEM_AUTHOR_PASSWORD
    public static GA_AUTH_REQUIRED = process.env.GA_AUTH_REQUIRED === 'true'
    public static BIO = process.env.BIO
    public static EXPANDABLE_TEASER = process.env.EXPANDABLE_TEASER
    public static PORTFOLIO = process.env.PORTFOLIO
    public static INSIGHTSFILTER = process.env.INSIGHTSFILTER
    public static PREFILTER = process.env.PREFILTER
    public static LINKLIST = process.env.LINKLIST
    public static BLOGRELATEDINSIGHTS = process.env.BLOGRELATEDINSIGHTS
    public static SIDEBYSIDEINSIGHTS = process.env.SIDEBYSIDEINSIGHTS
    public static BLOGRELATEDINSIGHTSONECARD = process.env.BLOGRELATEDINSIGHTSONECARD
    public static BLOGRELATEDINSIGHTSTWOCARD = process.env.BLOGRELATEDINSIGHTSTWOCARD
    public static BLOGRELATEDINSIGHTSTHREECARD = process.env.BLOGRELATEDINSIGHTSTHREECARD
    public static SUBSCRIBEfORM = process.env.SUBSCRIBEfORM
}


export default ENV;