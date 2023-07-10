document.addEventListener("DOMContentLoaded", function () {
    var grid = document.querySelector(".grid");
    var selectedImage = null;

    function adicionarArquivo(url) {
        var gridCell = document.createElement("div");
        gridCell.classList.add("grid-cell");
        gridCell.addEventListener("click", function () {
            selecionarImagem(this);
        });

        var elemento = new Image();
        elemento.onload = function () {
            gridCell.appendChild(elemento);
        };
        elemento.src = url;
        elemento.style.width = "100%";
        elemento.style.height = "auto";

        grid.appendChild(gridCell);
    }

    function selecionarImagem(gridCell) {
        if (selectedImage === gridCell) {
            gridCell.classList.remove("selected");
            selectedImage = null;
        } else {
            if (selectedImage) {
                trocarImagens(selectedImage, gridCell);
            } else {
                gridCell.classList.add("selected");
                selectedImage = gridCell;
            }
        }
    }

    function trocarImagens(gridCell1, gridCell2) {
        var image1 = gridCell1.querySelector("img");
        var image2 = gridCell2.querySelector("img");

        gridCell1.appendChild(image2);
        gridCell2.appendChild(image1);

        gridCell1.classList.remove("selected");
        gridCell2.classList.add("selected");

        selectedImage = gridCell2;
    }

    // Reference to the "=" icon
    var icon = document.querySelector(".sidebar-icon");

    // Click event on the "=" icon
    icon.addEventListener("click", function () {
        var fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.multiple = true;

        // Change event on the selected file(s)
        fileInput.addEventListener("change", function (event) {
            var files = event.target.files;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];

                // Check if it's an image
                if (file.type.startsWith("image/")) {
                    var url = URL.createObjectURL(file);
                    adicionarArquivo(url);
                }
            }
        });

        fileInput.click();
    });
});  