# Maneki
A Javascript library for creating terminal prompts in the browser

## Setup
Import via a script tag using

```html
<script type="text/javascript" src="https://expitau-dev.github.io/Maneki/Maneki.js"></script>
```

Initialize a Maneki instance in JavaScript with

```js
maneki = new Maneki(1)
```

Pass in the number of terminal tags (see below) as an argument. If no arguments are present, it will attempt to auto-detect the number of terminal tags in the DOM (you may need to defer your script to ensure that all tags are loaded)

## Usage

To create a terminal, simply create an element with the `<terminal>` tag
```html
<terminal style="color: white; background-color: black;"></terminal>
```

Use the style property to set the colour of the terminal. In JavaScript, you can attach commands to be executed to the terminal with

```js
t = maneki.terminals[0];
t.attachCommand("^help.*", () => {t.write("Put your help text here!"))
t.attachCommand("^print .*", (line) => {t.write("Printing the " + line.substr(6))})
```

The first argument is a regular expression or string representing the command to match. The second is a callback function that will be executed when the command is entered into the terminal.

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