// Append a stylesheet to <head> to style terminals
document.addEventListener("DOMContentLoaded", () => {
    let stylesheet = document.createElement('style');
    stylesheet.innerHTML = `
        .m_terminal, .m_terminal * {
            font-family: monospace; 
            margin: 0; 
            padding: 0px;
        }
        .m_terminal {
            height: 100%;
            overflow-y: scroll;
        }
        .m_terminal .m_input {
            border: none;
            outline: none;
            background: none;
            color: inherit;
            font-size: initial;
            flex: 1;
        }
        .m_terminal .m_prompt { 
            display: flex;
        } 
        .m_terminal .m_context { 
            display: inline; 
        } 

        .m_terminal::-webkit-scrollbar { 
            width: 15px; 
        } 
        .m_terminal::-webkit-scrollbar-track { 
            background: none; 
        } 
        .m_terminal::-webkit-scrollbar-thumb { 
            background: rgb(50, 50, 50); 
        } 
        .m_terminal::-webkit-scrollbar-thumb:hover { 
            background: rgb(70, 70, 70);
        }
    `;
    document.head.appendChild(stylesheet)
})

// Define library
let Maneki = new (function () {
    // For unique terminal ids
    let terminalIndex = 0;

    function Terminal(selector) {
        // this.id = 0, 1, 2...
        this.id = terminalIndex++;

        // Displayed before input field
        this.context = ">>>_";

        // The content to write, either a string or an html element
        this.content = [];

        // HTML id of terminal
        this.selector = selector;

        // Has the DOM been initialized yet
        this.initialized = false;

        // List of event listeners
        let _eventlisteners = {};

        // Append to _eventlisteners
        this.addEventListener = (e, f) => {
            _eventlisteners[e] || (() => {_eventlisteners[e] = []})();
            _eventlisteners[e].push(f)
        }

        // Remove from _eventlisteners
        this.removeEventListener = (e, f) => {
            _eventlisteners[e] = _eventlisteners[e].filter(i => {return i != f})
        }

        // Execute all listening events
        this.dispatchEvent = (e, ...args) => {
            let callbacks = _eventlisteners[e] || []

            for (const f of callbacks){
                this.removeEventListener(e,f)
                f(...args);
            }
        }

        // When the user enters a key in the input field
        this.onKeyDown = () => {
            // Get the event
            let event = window.event || event.which;
            if (event.keyCode == 13) { // If the user presses the 'enter' key
                event.preventDefault();

                // Get the line the user wrote
                let inputElement = document.querySelector(`#m_terminal_${this.id} .m_prompt .m_input`)
                let line = inputElement.value

                // Print the line the user wrote
                this.write(this.context + line);
                inputElement.value = "";

                // Execute all listening commands
                this.dispatchEvent("onCommand", line)
            }
        }

        // Flush this.content to the screen
        this.flush = () => {
            if (this.initialized) {
                let text = document.querySelector(`#m_terminal_${this.id} .m_text`);
                text.innerHTML = '';
                this.content.forEach((line) => {
                    let element;
                    if (typeof line === 'string') {
                        element = document.createElement("p")
                        element.appendChild(document.createTextNode(line))
                    } else if (typeof line === 'object') {
                        element = line;
                    }
                    text.appendChild(element)
                })
                document.querySelector(`#m_terminal_${this.id} .m_prompt .m_context`).innerHTML = this.context;
                document.querySelector(`#m_terminal_${this.id}`).scrollTop = document.querySelector(`#m_terminal_${this.id}`).scrollHeight;
            } else {
                document.addEventListener("DOMContentLoaded", () => { this.initialized && this.flush() })
            }
        }

        // Append a line to the terminal
        this.write = (line = "") => {
            if (typeof line === 'string') {
                for (const part of line.split("\n")) {
                    this.content.push(part);
                }
            } else {
                this.content.push(line);
            }
            this.flush()
        }

        // Clear the terminal
        this.clear = () => {
            this.content = []
            this.flush()
        }

        // Initialize the terminal display. Only execute after 'DOMContentLoaded'
        this.init = () => {
            let element = document.querySelector("terminal#" + this.selector)
            if (!element)
                return null

            element.outerHTML = `
            <div style="${element.style?.cssText}" id="${element.id || ''}" class="${element.class || ''}">
                <div style="all:initial; background-color: inherit; color: inherit"> 
                    <div class="m_terminal" id="m_terminal_${this.id}" onClick="document.querySelector('#m_terminal_${this.id} .m_prompt .m_input').focus()"> 
                        <p class="m_text"></p> 
                        <div class="m_prompt"> 
                            <p class="m_context" style="white-space: pre;"></p> 
                            <input class="m_input" autofocus rows="1" onkeydown="Maneki.getTerminal('${this.selector}').onKeyDown();"></input> 
                        </div> 
                    </div> 
                </div> 
            </div>`;
            this.initialized = true;
            this.flush();
            return element;
        }

        // Initialize, or wait to initialize
        this.element = this.init();
        this.element || document.addEventListener("DOMContentLoaded", () => { this.element = this.init() })
    };

    // List of terminals
    let terminals = {}
    this.getTerminal = (id) => {
        if (!terminals[id])
            terminals[id] = new Terminal(id)
        return terminals[id]
    }
})();

// Initialize all terminals
document.addEventListener("DOMContentLoaded", () => {
    for (const e of document.querySelectorAll("terminal")) {
        Maneki.getTerminal(`${e.id}`);
    }
})
