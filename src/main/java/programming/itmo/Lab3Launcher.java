package programming.itmo;

import programming.itmo.config.AppStrings;

public final class Lab3Launcher {

    private Lab3Launcher() {
    }

    public static void main(String[] args) {
        System.out.println(AppStrings.get("launcher.title"));
        System.out.println(AppStrings.get("launcher.description"));
        System.out.println(AppStrings.get("launcher.args.prefix") + args.length);
        System.out.println(AppStrings.get("launcher.web.resources.note"));
    }
}
