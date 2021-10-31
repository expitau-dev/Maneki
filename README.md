# Maneki
A Javascript library for creating terminal prompts in the browser

## Setup
Import via a script tag using

```html
<script type="text/javascript" src="https://expitau-dev.github.io/Maneki/Maneki.js"></script>
```

## Usage

To create a terminal, simply create an element with the `<terminal>` tag. It must have a unique id.

```html
<terminal id="myterminal" style="color: white; background-color: black; margin: 5%;"></terminal>
```

Use the style property to set the colour of the terminal. In JavaScript, you can add listeners  to be executed when the user enters a command in the terminal with

```js
t = Maneki.getTerminal("myterminal");
t.addEventListener("onCommand", (line) => {t.write("You entered a command");
t.write(line)
})
```

When a command is entered in the terminal, the callback function will be executed.

<br>

You can also directly modify lines with
```js
t.content[0] = "The first line has changed!"
t.flush()
```

To change the context (prefix), use `t.context`
```js
t.context = "$ "
t.flush()
```