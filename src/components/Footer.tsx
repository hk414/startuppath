import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/startuppath-logo.jpg";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-gradient-subtle border-t border-border py-12 px-4">
      <div className="container max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <img src={logo} alt="StartUpPath Logo" className="w-10 h-10 rounded-lg shadow-soft" />
              <span className="text-2xl font-bold text-foreground">StartUpPath</span>
            </div>
            <p className="text-muted-foreground max-w-md leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">{t('footer.product')}</h3>
            <ul className="space-y-3">
              <li><a href="#features" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.features')}</a></li>
              <li><a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.pricing')}</a></li>
              <li><a href="#cta" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.caseStudies')}</a></li>
              <li><a href="/guidebook" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.guidebook')}</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">{t('footer.company')}</h3>
            <ul className="space-y-3">
              <li><a href="#cta" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.about')}</a></li>
              <li><a href="#cta" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.blog')}</a></li>
              <li><a href="#cta" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.careers')}</a></li>
              <li><a href="#cta" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.contact')}</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} StartUpPath. {t('footer.copyright')}
          </p>
          <div className="flex gap-6 text-sm">
            <a href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.privacy')}</a>
            <a href="/terms" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.terms')}</a>
            <a href="/privacy#cookies" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.cookies')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
