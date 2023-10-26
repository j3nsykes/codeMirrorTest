document.addEventListener("DOMContentLoaded", () => {
  startWebcam();

  const codeEditor = CodeMirror.fromTextArea(document.getElementById("editor"), {
    mode: "javascript",
    theme: 'my-theme', // Apply the custom theme
    lineNumbers: true,
    autoCloseBrackets: true,
    matchBrackets: true,
    indentUnit: 4,
    tabSize: 4,
  });


 const initialCode = `function setup() {
canvas = createCanvas(400, 400);

}

function draw() {
  background(220);
  ellipse(200, 200, 50, 50);
}`;

typeCode(initialCode, codeEditor);
  //codeEditor.setValue(initialCode);

  const runButton = document.getElementById("run");
  const stopButton = document.getElementById("stop");
  const revertButton = document.getElementById("revert");
  const rectangleButton = document.getElementById("rectangle");
  const preview = document.getElementById("preview");
  //const previewContainer = document.getElementById("preview-container");

  let iframe = null;
  const canvasSize = {
    width: 400,
    height: 400,
  };

  runButton.addEventListener("click", () => {
    if (iframe) {
      preview.removeChild(iframe);
    }
    iframe = document.createElement("iframe");
    iframe.setAttribute("width", canvasSize.width);
    iframe.setAttribute("height", canvasSize.height);
    preview.appendChild(iframe);
    
    const script = `
    <style>
      body {
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      canvas {
        display: block;
      }
    </style>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js"><\/script>
    <script>${codeEditor.getValue()}<\/script>
  `;
  iframe.contentWindow.document.write(script);
  iframe.contentWindow.document.close();
  });

  stopButton.addEventListener("click", () => {
    if (iframe) {
      preview.removeChild(iframe);
      iframe = null;
    }
  });

  revertButton.addEventListener("click", () => {
    clearEditor();
    typeCode(initialCode, codeEditor);
    //codeEditor.setValue(initialCode);
  
  });

  rectangleButton.addEventListener("click", () => {
    removeLastChar();
    const rectangleCode = `
  rect(150, 150, 100, 50);
}
`;
typeCode(rectangleCode, codeEditor);
  // codeEditor.setValue(rectangleCode);
  });


// Simulate typing
function typeCode(code, editor, index = 0, delay = 30) {
  if (index < code.length) {
    editor.replaceRange(code[index], editor.getDoc().getCursor());
    editor.setCursor(editor.getDoc().getCursor());
    setTimeout(() => typeCode(code, editor, index + 1, delay), delay);
  }
}
function clearEditor() {
  codeEditor.setValue("");
}
function removeLastChar(){

  // Assuming you have a CodeMirror instance named `editor`
const doc = codeEditor.getDoc();
const lastLine = doc.lastLine();
const lastCharPos = doc.getLine(lastLine).length;

// If there's at least one character to delete
if (lastCharPos > 0) {
  const from = CodeMirror.Pos(lastLine, lastCharPos - 1);
  const to = CodeMirror.Pos(lastLine, lastCharPos);

  // Delete the last character
  doc.replaceRange("", from, to);
} else if (lastLine > 0) {
  // If there are no characters on the last line but there are multiple lines
  doc.replaceRange("", CodeMirror.Pos(lastLine - 1, doc.getLine(lastLine - 1).length), CodeMirror.Pos(lastLine, 0));
}

}
});

async function startWebcam() {
  const video = document.getElementById("webcam");
  if (navigator.mediaDevices.getUserMedia) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      video.play();
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  }
}