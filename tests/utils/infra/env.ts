class ENV {
    public static get BASE_URL() { return process.env.BASE_URL }
    public static get AEM_AUTHOR_URL() { return process.env.AEM_AUTHOR_URL }
    public static get AEM_AUTHOR_USERNAME() { return process.env.AEM_AUTHOR_USERNAME }
    public static get AEM_AUTHOR_PASSWORD() { return process.env.AEM_AUTHOR_PASSWORD }
    public static get GA_AUTH_REQUIRED() { return process.env.GA_AUTH_REQUIRED === 'true' }
    public static get BIO() { return process.env.BIO }
    public static get EXPANDABLE_TEASER() { return process.env.EXPANDABLE_TEASER }
    public static get PORTFOLIO() { return process.env.PORTFOLIO }
    public static get INSIGHTSFILTER() { return process.env.INSIGHTSFILTER }
    public static get PREFILTER() { return process.env.PREFILTER }
    public static get LINKLIST() { return process.env.LINKLIST }
    public static get BLOGRELATEDINSIGHTS() { return process.env.BLOGRELATEDINSIGHTS }
    public static get SIDEBYSIDEINSIGHTS() { return process.env.SIDEBYSIDEINSIGHTS }
    public static get BLOGRELATEDINSIGHTSONECARD() { return process.env.BLOGRELATEDINSIGHTSONECARD }
    public static get BLOGRELATEDINSIGHTSTWOCARD() { return process.env.BLOGRELATEDINSIGHTSTWOCARD }
    public static get BLOGRELATEDINSIGHTSTHREECARD() { return process.env.BLOGRELATEDINSIGHTSTHREECARD }
    public static get SUBSCRIBEfORM() { return process.env.SUBSCRIBEfORM }
}


export default ENV;
