export function routeMatches(pathname: string, matcher: string[]) {
    const subRoutes = pathname.split("/");

    for (const route of matcher) {
        const matcherSubRoutes = route.split("/");

        if (matcherSubRoutes.length !== subRoutes.length) continue;

        for (let i = 0; i < matcherSubRoutes.length; i++) {
            const msr = matcherSubRoutes[i];
            const dynamicParamRegExp = /^\[[\d\w]{1,}\]$/m;

            if (dynamicParamRegExp.test(msr)) {
                if (i + 1 === matcherSubRoutes.length) return true;

                continue;
            }

            if (msr !== subRoutes[i]) break;

            if (i + 1 === matcherSubRoutes.length) return true;
        }
    }
}
