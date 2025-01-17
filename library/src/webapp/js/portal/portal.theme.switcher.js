var portal = portal || {};

portal.darkThemeSwitcher = document.getElementById("sakai-dark-theme-switcher");

portal.defaultThemeClass = 'sakaiUserTheme-notSet';
portal.lightThemeClass = 'sakaiUserTheme-light';
portal.darkThemeClass = 'sakaiUserTheme-dark';

portal.toggleDarkTheme = () => {
  // toggle the dark theme switch to the opposite state
  portal.darkThemeSwitcher && portal.darkThemeSwitcher.getAttribute("aria-checked") === "false" ? portal.enableDarkTheme() : portal.enableLightTheme();
};

portal.setDarkThemeSwitcherToggle = onOff => {
  portal.darkThemeSwitcher && portal.darkThemeSwitcher.setAttribute("aria-checked", onOff);
};

portal.addCssClassToMarkup = themeClass => document.documentElement.classList.add(themeClass);

portal.removeCssClassFromMarkup = themeClass => document.documentElement.classList.remove(themeClass);

portal.isOsDarkThemeSet = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

portal.setPortalThemeUserPref = theme => {

  const url = `/direct/userPrefs/updateKey/${portal.user.id}/sakai:portal:theme?theme=${theme}`;
  fetch(url, { method: "PUT", credentials: "include" })
  .then(r => {

    if (!r.ok) {
      throw new Error(`Network error while updating theme pref at ${url}`);
    }
  })
  .catch (error => console.error(error));
};

portal.enableDarkTheme = () => {

  portal.setDarkThemeSwitcherToggle(true);
  portal.removeCssClassFromMarkup(portal.defaultThemeClass);
  portal.removeCssClassFromMarkup(portal.lightThemeClass);
  portal.addCssClassToMarkup(portal.darkThemeClass);
  portal.setPortalThemeUserPref(portal.darkThemeClass);
  portal.darkThemeSwitcher.title = portal.i18n.theme_switch_to_light;
};

portal.enableLightTheme = () => {

  portal.setDarkThemeSwitcherToggle(false);
  portal.removeCssClassFromMarkup(portal.defaultThemeClass);
  portal.removeCssClassFromMarkup(portal.darkThemeClass);
  portal.addCssClassToMarkup(portal.lightThemeClass);
  portal.setPortalThemeUserPref(portal.lightThemeClass);
  portal.darkThemeSwitcher.title = portal.i18n.theme_switch_to_dark;
};

// if the dark theme switch is on the page, attach listener to dark theme toggle switch
portal.darkThemeSwitcher && portal.darkThemeSwitcher.addEventListener('click', portal.toggleDarkTheme, false);

if (portal.userThemeAutoDetectDark) {
  if (portal.user.id) {
    // only check for unset theme preference because light and dark themes are already set by Java
    if (portal.userTheme === portal.defaultThemeClass) {
      // if the user has dark mode set on their OS, enable dark mode
      portal.isOsDarkThemeSet() ? portal.enableDarkTheme() : portal.setPortalThemeUserPref(portal.lightThemeClass);
    }
  } else if (portal.isOsDarkThemeSet()) {
    // just add the dark theme to the markup if not logged in and the user has dark mode set on their OS (no prefs to save)
    portal.addCssClassToMarkup(portal.darkThemeClass);
  }
}

if (document.documentElement.classList.contains(portal.darkThemeClass)) {
  // the dark theme switch toggle is off by default, so toggle it to on if dark theme is enabled
  portal.setDarkThemeSwitcherToggle(true);
}
