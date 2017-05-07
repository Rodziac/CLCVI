/**
 * Initializing application.
 * @type {Object}
 */
var Application = function(config) {
    /**
     * Configuration for our Application.
     * Required Configs:
     * initialScript points to first script to load after this file is done loading.
     * @type {Object}
     * @private
     */
    this.config_ = config;

    /**
     * An array of strings which show which files were already loaded to prevent double loading.
     * @type {Array}
     * @private
     */
    this.loadedFiles_ = [];

    /**
     * An array of listened events to remove them when wanted.
     * @type {Array}
     * @private
     */
    this.listenedEvents_ = [];
};

/**
 * This is a function to load jsFile on the page.
 * If a script file needs another script file to run, function can be used to import that script.
 * This is a wrapper for importFile_ function.
 * @param jsFile Path to the javascript file
 * @param callback optional function to run after loading is complete
 * @param scope optional scope for callback
 */
Application.prototype.importJS = function(jsFile, callback, scope) {
    if (typeof jsFile === "string") {
        this.importFile_(jsFile, "js", callback, scope);
    } else if (typeof jsFile === "object" && jsFile.length > 0) {
        var that = this;
        jsFile.forEach(function(file, index){
            that.importFile_(file, "js", index + 1 === jsFile.length ? callback : false, scope);
        });
    }
};

/**
 * This is a function to load cssfile on the page.
 * If a page needs a specific css file, we can use this to import it on the fly.
 * This is a wrapper for importFile_ function.
 * @param cssFile Path to the css file
 * @param callback optional function to run after loading is complete
 * @param scope optional scope for callback
 */
Application.prototype.importCSS = function(cssFile, callback, scope) {
    if (typeof cssFile === "string") {
        this.importFile_(cssFile, "css", callback, scope);
    } else if (typeof cssFile === "object" && cssFile.length > 0) {
        var that = this;
        cssFile.forEach(function(file, index){
            that.importFile_(file, "css", index + 1 === cssFile.length ? callback : false, scope);
        });
    }
};

/**
 * This is a function to load a file with type.
 * @param file path to file
 * @param type type of the file to construct html tag ("js"/"css")
 * @param callback optional function to run after loading is complete
 * @param scope optional scope for callback
 * @private
 */
Application.prototype.importFile_ = function(file, type, callback, scope) {
    if (this.loadedFiles_.indexOf(file) === -1) {
        this.loadedFiles_.push(file);
        switch (type) {
            case "js":
                var jsElement = document.createElement("script");
                jsElement.onload = function() {
                    if (callback) {
                        callback.call(scope || this);
                    }
                };
                jsElement.type = "text/javascript";
                jsElement.src = file;
                document.body.appendChild(jsElement);
                break;
            case "css":
                var cssElement = document.createElement("link");
                cssElement.onload = function() {
                    if (callback) {
                        callback.call(scope || this);
                    }
                };
                cssElement.rel = "stylesheet";
                cssElement.href = file;
                document.head.appendChild(cssElement);
                break;
        }
    }
};

/**
 * dispatchEvent wrapper on document to make event dispatching easier.
 * @param eventName event name
 * @param eventData event data
 */
Application.prototype.fireEvent = function(eventName, eventData) {
    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent(eventName, true, true, eventData);
    document.dispatchEvent(evt);
};

/**
 * catch an event and run callback when it is found.
 * @param eventName event name
 * @param callback function to run after
 */
Application.prototype.listenEvent = function(eventName, callback) {
    document.addEventListener(eventName, callback);
    var id = this.listenedEvents_.length;
    this.listenedEvents_.push({eventName: eventName, callback: callback});
    return id;
};

/**
 * Remove an event listener
 * @param eventId
 */
Application.prototype.removeEvent = function(eventId) {
    var event = this.listenedEvents_[eventId];
    document.removeEventListener(event.eventName, event.callback);
};

/**
 * Starting the application with initialScript config
 */
Application.prototype.startApplication = function() {
    var that = this;
    this.importJS(this.config_.initialScript, function(){
        new Function(that.config_.initialFunction)();
    });
};
