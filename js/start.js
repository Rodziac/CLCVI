/**
 * Initializing project Clcvi
 */
var Clcvi = function() {
    this.loadStyles();
    this.loadScripts();
};

/**
 * Load necessary styles for the project
 */
Clcvi.prototype.loadStyles = function() {
    app.importCSS("https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css");
    app.importCSS("https://fonts.googleapis.com/css?family=Ubuntu+Mono");
};

/**
 * Load necessary scripts for the project
 */
Clcvi.prototype.loadScripts = function() {
    app.importJS("js/thirdparty/ua-parser.min.js", this.routeForDevice, this);
};

/**
 * Load mobile version
 */
Clcvi.prototype.initMobile = function() {
    document.body.appendChild(new Node("mobile version!"));
};

/**
 * Load desktop version
 */
Clcvi.prototype.initDesktop = function() {
    app.importJS("js/desktop/cli.js", function() {
        new Clcvi.Cli();
    }, this);
};

/**
 * Router to load specific platform of the application
 */
Clcvi.prototype.routeForDevice = function() {
    var parser = new UAParser();
    switch (parser.getDevice().type) {
        case "mobile":
            this.initMobile();
            break;
        default:
            this.initDesktop();
            break;
    }
};
