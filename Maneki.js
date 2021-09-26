class Maneki_Terminal {
    constructor(id) {
        this.id = "m_terminal_" + id;
        this.content = [];
        this.context = ">>> ";
        this.commands = [];
    }

    attachCommand(trigger, f) {
        this.commands.push({ rexp: trigger, action: f })
    }

    onKeyDown() {
        var event = window.event || event.which;

        if (event.keyCode == 13) {
            event.preventDefault();
            var line = document.getElementById(this.id + "_input").value
            this.write(this.context + line);
            this.commands.forEach(cmd => line.match(cmd.rexp) && cmd.action(line))
            document.getElementById(this.id + "_input").value = "";
        }

        document.getElementById(this.id + "_input").style.height = (document.getElementById(this.id + "_input").scrollHeight) + "px";
    }

    flush() {
        let text = document.getElementById(this.id + "_text");
        text.innerHTML = '';
        this.content.forEach((line) => {
            text.appendChild(document.createTextNode(line))
            text.appendChild(document.createElement("br"))
        })
        document.getElementById(this.id + "_context").innerHTML = this.context;
    }

    write(line = "") {
        // img = line.split("image/")[1]
        // imageElement = document.createElement("img")
        // imageElement.setAttribute("src", img)
        // imageElement.setAttribute("width", "42%")
        // document.getElementById("m_terminal_0_text").appendChild(imageElement);
        // document.getElementById("m_terminal_0_text").appendChild(document.createElement("br"));
        // document.getElementById("m_terminal_0_text").appendChild(document.createElement("br"));
        for (const part of line.split("\n")) {
            this.content.push(part);
        }
        this.flush()
        document.getElementById(this.id).scrollTop = document.getElementById(this.id).scrollHeight;
    }

    clear() {
        this.content = []
        this.flush()
    }
}

class Maneki {

    constructor(n = 0) {
        if (n == 0) {
            this.terminals = Array.from(document.getElementsByTagName('terminal')).map((x, i) => (new Maneki_Terminal(i)))
            this._init();
        } else {
            this.terminals = Array(n).fill().map((x, i) => (new Maneki_Terminal(i)))
            document.addEventListener("DOMContentLoaded", () => {
                this._init();
            })
        }

    }

    _init() {
        let terminal_stylesheet = document.createElement('style')
        terminal_stylesheet.innerHTML = " \
        .m_terminal { \
            margin: 0; \
            padding: 0px; \
            height: 100%; \
            overflow-y: auto; \
            font-family: Monospace; \
        } \
        .m_terminal_text { \
            margin: 0px 0px 0px 0px; \
        } \
        .m_terminal_input { \
            resize: none; \
            margin: -10px 0px -3px -9px; \
            border: none; \
            outline: none; \
            background: none; \
            width: 90%; \
            overflow: hidden; \
            color: inherit; \
        } \
        .m_terminal_prompt { \
            margin: 0px 0px 0px 0px; \
        } \
        .m_terminal_context { \
            display: inline; \
        } \
        .m_terminal::-webkit-scrollbar { \
            width: 15px; \
        } \
        .m_terminal::-webkit-scrollbar-track { \
            background: rgb(0, 0, 0); \
        } \
        .m_terminal::-webkit-scrollbar-thumb { \
            background: rgb(50, 50, 50); \
        } \
        .m_terminal::-webkit-scrollbar-thumb:hover { \
            background: rgb(70, 70, 70); \
        }"
        document.head.appendChild(terminal_stylesheet);

        Array.from(document.getElementsByTagName('terminal')).forEach((element, i) => {
            element.outerHTML = " \
            <div style=\"" + element.style.cssText + "\"" + " " + `id=\"${element.id || ''}\"` + " " + `class=\"${element.class || ''}\"` + "> \
                <div style=\"all:initial; background-color: inherit; color: inherit\"> \
                    <div class=\"m_terminal\" id=\"m_terminal_"+ i + "\" onClick=\"document.getElementById('m_terminal_" + i + "_input').focus()\"> \
                        <p class=\"m_terminal_text\" id=\"m_terminal_"+ i + "_text\"></p> \
                        <div class=\"m_terminal_prompt\" id=\"m_terminal_"+ i + "_prompt\"> \
                            <p class=\"m_terminal_context\" id=\"m_terminal_" + i + "_context\">\"" + this.terminals[i].context + "\"</p> \
                            <textarea class=\"m_terminal_input\" autofocus rows=\"1\" id=\"m_terminal_"+ i + "_input\" onkeydown=\"maneki.terminals[" + i + "].onKeyDown();\"></textarea> \
                        </div> \
                    </div> \
                </div> \
            </div>";
        });
    }
}

