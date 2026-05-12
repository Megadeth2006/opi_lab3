package programming.itmo.config;

import java.util.Locale;
import java.util.ResourceBundle;

public final class AppStrings {

    private static final ResourceBundle BUNDLE =
            ResourceBundle.getBundle("i18n.messages", Locale.getDefault());

    private AppStrings() {
    }

    public static String get(String key) {
        return BUNDLE.getString(key);
    }
}
