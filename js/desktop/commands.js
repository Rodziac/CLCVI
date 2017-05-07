Clcvi.Cli.prototype.clearHistory = function() {
    this.commandHistoryEl.innerText = "";
};

Clcvi.Cli.prototype.nodeExecute = function(params) {
    if (params.length === 1) {
        var requestedPath = params.length === 0 ?
            this.currentDirectory :
            (
                (
                    params[0][0] === "/" ?
                        "" :
                        this.currentDirectory + (
                            this.currentDirectory.length === 1 ?
                                "" :
                                "/"
                        )
                ) + params[0]
            );
        var requestedPathSections = requestedPath === "/" ? [""] : requestedPath.split("/");
        requestedPathSections[0] = "/";
        var inspector = this.fileMap;
        var that = this;
        var success = false;
        requestedPathSections.some(function (item, index) {
            if (inspector[item]) {
                if (inspector[item].type === "folder") {
                    inspector = inspector[item].contents;
                } else if (inspector[item].type === "file" && index + 1 === requestedPathSections.length) {
                    success = true;
                    inspector[item].execute.call(that);
                }
            } else {
                that.commandHistoryEl.innerText += "\n" + "File cannot be found.";
                return true;
            }
        });
        if (!success) {
            that.commandHistoryEl.innerText += "\n" + "Executable file not found.";
        }
    } else {
        this.commandHistoryEl.innerText += "\n" + "Wrong usage of command, enter \"help node\" for help.";
    }
};

Clcvi.Cli.prototype.commandHelp = function(params) {
    var spacing = "";
    if (params.length === 0) {
        var that = this;
        Object.keys(this.commandList).forEach(function(item) {
            spacing = "&nbsp;".repeat(7 - item.length);
            that.commandHistoryEl.innerHTML += "<br>" +
                item + spacing + that.commandList[item].info;
        });
    } else if (params.length === 1) {
        if (this.commandList[params[0]]) {
            spacing = "&nbsp;".repeat(7 - params[0].length);
            this.commandHistoryEl.innerHTML += "<br>" + params[0] + spacing + this.commandList[params[0]].help;
        } else {
            this.commandHistoryEl.innerText += "\n" + "Specified command cannot be found.";
        }
    } else {
        this.commandHistoryEl.innerText += "\n" + "Wrong usage of command, enter \"help help\" for help.";
    }
};

Clcvi.Cli.prototype.changeDirectory = function(params) {
    if (params.length === 1 && params[0] !== "") {
        var requestedPath = (
            params[0][0] === "/" ?
                "" :
                this.currentDirectory + (
                    this.currentDirectory.length === 1 ?
                        "" :
                        "/"
                )
            ) + params[0];
        requestedPath = requestedPath.replace(/\/$/, "");
        while (requestedPath.indexOf("/..") > -1) {
            if (requestedPath.indexOf("/..") === 0) {
                requestedPath = requestedPath.replace(/^\/\.\./gi, "");
            } else {
                requestedPath = requestedPath.replace(/\/[^/.]*\/\.\./, "");
            }
        }
        requestedPath = requestedPath.replace(/\/$/, "");
        if (requestedPath === "") {
            requestedPath = "/";
        } else if (requestedPath !== "/") {
            var requestedPathSections = requestedPath.split("/");
            requestedPathSections[0] = "/";
            var inspector = this.fileMap;
            var that = this;
            requestedPathSections.some(function (item) {
                if (inspector[item] && inspector[item].type === "folder") {
                    inspector = inspector[item].contents;
                } else {
                    that.commandHistoryEl.innerText += "\n" + "Path cannot be found.";
                    requestedPath = that.currentDirectory;
                    return true;
                }
            });
        }

        this.currentDirectory = requestedPath;
    } else {
        this.commandHistoryEl.innerText += "\n" + "Wrong usage of command, enter \"help cd\" for help.";
    }
};

Clcvi.Cli.prototype.listFiles = function(params) {
    if (params.length <= 1) {

        var requestedPath = params.length === 0 ?
            this.currentDirectory :
            (
                (
                    params[0][0] === "/" ?
                        "" :
                        this.currentDirectory + (
                            this.currentDirectory.length === 1 ?
                                "" :
                                "/"
                        )
                ) + params[0]
            );
        var requestedPathSections = requestedPath === "/" ? [""] : requestedPath.split("/");
        requestedPathSections[0] = "/";
        var inspector = this.fileMap;
        var that = this;
        requestedPathSections.some(function (item) {
            if (inspector[item] && inspector[item].type === "folder") {
                inspector = inspector[item].contents;
            } else {
                that.commandHistoryEl.innerText += "\n" + "Path cannot be found.";
                inspector = false;
                return true;
            }
        });
        if (inspector) {
            Object.keys(inspector).forEach(function(item){
                that.commandHistoryEl.innerText += "\n" + (inspector[item].type === "folder" ? "/" : "") + item;
            });
        }
    } else {
        this.commandHistoryEl.innerText += "\n" + "Wrong usage of command, enter \"help cd\" for help.";
    }
};
