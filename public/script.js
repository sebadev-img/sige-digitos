const inpFile = document.getElementById("inpFile");
const textFile = document.getElementById("textFile");
const btnUpload = document.getElementById("btnUpload");
const resultText = document.getElementById("resultText");
const ul = document.getElementById("ul");

btnUpload.disabled = true;

const getUniqueDNI = (text) => {
  if (text) {
    while (ul.firstChild) {
      ul.removeChild(ul.firstChild);
    }
    const textArray = text.split("\n");
    let dniArray = textArray.filter(
      (word) => word.length === 10 && !word.includes("/")
    );
    console.log("primer array", dniArray);
    let dniPPArray = dniArray.filter((dni) => dni.startsWith("pp"));
    console.log("array pp", dniPPArray);
    dniPPArray = dniPPArray.map((dni) => dni.slice(2));
    console.log("array pp solo numeros", dniPPArray);
    const uniqueDNI = [...new Set(dniPPArray)].sort((a, b) => a - b);
    console.log("array pp dni unicos", uniqueDNI);
    uniqueDNI.map((dni) => {
      const node = document.createElement("li");
      node.appendChild(document.createTextNode(dni));
      node.addEventListener("click", () => {
        //node.classList.toggle("complete");
        const URL =
          "https://sige.tierradelfuego.gob.ar/SIGEGX/serviciosdeldocente.aspx?" +
          dni;
        window.open(URL, "_blank");
      });
      ul.appendChild(node);
    });
  }
};

inpFile.addEventListener("change", () => {
  if (inpFile.value) {
    textFile.innerHTML = inpFile.value.match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1];
    btnUpload.disabled = false;
  } else {
    textFile.innerHTML = "Ningun Archivo Seleccionado";
  }
});

btnUpload.addEventListener("click", () => {
  const formData = new FormData();
  formData.append("pdfFile", inpFile.files[0]);
  fetch("/extract-text", {
    method: "post",
    body: formData,
  })
    .then((response) => {
      return response.text();
    })
    .then((extractedText) => {
      getUniqueDNI(extractedText);
    });
});
