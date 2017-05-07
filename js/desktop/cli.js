/**
 * Initialize desktop component of project
 */
Clcvi.Cli = function() {
    this.el = document.getElementById("siteContainer");
    this.currentDirectory = "/";

    this.loadStyles();
    this.loadScripts();
    this.render();
    this.attachEvents();
};

Clcvi.Cli.prototype.setFilesystem = function() {
    this.commandList = {
        ls: {
            execute: this.listFiles,
            info: "List files and folders in path.",
            help: "Usage: ls [?path]\nList files in current or specified path."
        },
        cd: {
            execute: this.changeDirectory,
            info: "Change current directory to path.",
            help: "Usage: cd [path]\nChange current directory to specified path."
        },
        help: {
            execute: this.commandHelp,
            info: "Displays help message",
            help: "Usage: help [?command]\nShows help message for CLI or specified command."
        },
        node: {
            execute: this.nodeExecute,
            info: "Executes specified js file.",
            help: "Usage: node [file]\nExecutes specified js file."
        },
        clear: {
            execute: this.clearHistory,
            info: "Clears screen.",
            help: "Usage: clear\nClears screen."
        }
    };

    this.fileMap = {
        "/": {
            type: "folder",
            contents: {
                "folder1": {
                    type: "folder",
                    contents: {
                        "folder11": {
                            type: "folder",
                            content: {}
                        },
                        "folder12": {
                            type: "folder",
                            content: {}
                        }
                    }
                },
                "folder2": {
                    type: "folder",
                    contents: {
                        "file21.js": {
                            type: "file",
                            execute: function() {
                                console.log("file21.js");
                            }
                        },
                        "file22.js": {
                            type: "file",
                            execute: function() {
                                console.log("file22.js");
                            }
                        }
                    }
                },
                "file1.js": {
                    type: "file",
                    execute: function() {
                        console.log("file1.js");
                    }
                },
                "file2.js": {
                    type: "file",
                    execute: function() {
                        console.log("file2.js");
                    }
                }
            }
        }
    }
};

Clcvi.Cli.prototype.loadStyles = function() {
    app.importCSS("css/cli.css");
};

Clcvi.Cli.prototype.loadScripts = function() {
    app.importJS("js/desktop/commands.js", this.setFilesystem, this);
};

Clcvi.Cli.prototype.render = function() {
    this.el.innerHTML = this.template();
    this.inputPrefixEl = document.getElementById("inputPrefix");
    this.commandHistoryEl = document.getElementById("commandHistory");
    this.commandInputEl = document.getElementById("commandInput");
};

Clcvi.Cli.prototype.attachEvents = function() {
    var that = this;
    this.commandInputEl.addEventListener("keydown", function(e) {
        that.inputKeydown(e);
    });
    document.body.addEventListener("keydown", function(e){
        if (!e.ctrlKey) {
            that.commandInputEl.focus();
        }
    })
};

Clcvi.Cli.prototype.inputKeydown = function(e) {
    if (e.keyCode === 13) {
        var commandParams = this.commandInputEl.value.split(" ");
        var commandName = commandParams.shift();

        this.commandHistoryEl.innerText += (this.commandHistoryEl.innerText.length ? "\n" : "") +
            this.inputPrefixEl.innerText +
            " " +
            this.commandInputEl.value;
        this.commandInputEl.value = "";
        if (this.commandList[commandName]) {
            this.commandList[commandName].execute.call(this, commandParams);
        } else {
            this.commandHistoryEl.innerText += "\n" + "Command \"" + commandName + "\" cannot be found. Type \"help\" for list of commands.";
        }
        this.commandInputEl.scrollIntoView();
    }
    this.inputPrefixEl.innerText = "CV:" + this.currentDirectory + ">";
};

Clcvi.Cli.prototype.template = function() {
    return  "<div id='commandHistory'></div>" +
            "<div id='inputArea'>" +
                "<span id='inputPrefix'>CV:" + this.currentDirectory + "></span>" +
                "<input id='commandInput' type='text'/>" +
            "</div>";
};
