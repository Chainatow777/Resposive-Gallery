document.addEventListener("DOMContentLoaded", function () {
    var grid = document.querySelector(".grid");
    var selectedImage = null;

    var plus = document.querySelector('#plus');

    document.addEventListener('mousemove', function(event) {
      var rect = plus.getBoundingClientRect();
      var centerX = rect.left + rect.width / 2;
      var centerY = rect.top + rect.height / 2;
    
      var mouseX = event.pageX;
      var mouseY = event.pageY;
    
      var radians = Math.atan2(mouseY - centerY, mouseX - centerX);
      var degree = radians * (180 / Math.PI);
    
      plus.style.transform = 'rotate(' + degree + 'deg)';
    });
    
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
        var changePositionsCheckbox = document.getElementById("change-positions");
        if (!changePositionsCheckbox.checked) {
            if (gridCell.classList.contains("expanded")) {
                fecharImagem(gridCell);
            } else {
                expandirImagem(gridCell);
            }
        } else {
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
    }

    function expandirImagem(gridCell) {
        var changePositionsCheckbox = document.getElementById("change-positions");
        if (!changePositionsCheckbox.checked && !gridCell.classList.contains("expanded")) {
            var image = gridCell.querySelector("img");
            gridCell.classList.add("expanded");
            image.style.maxWidth = "100%";
            image.style.maxHeight = "100%";

            // Ativar a classe "active" após um pequeno atraso para acionar a transição suave
            setTimeout(function () {
                gridCell.classList.add("active");
            }, 10);
        }
    }

    function fecharImagem(gridCell) {
        var changePositionsCheckbox = document.getElementById("change-positions");
        if (!changePositionsCheckbox.checked) {
            gridCell.classList.remove("active");

            setTimeout(function () {
                gridCell.classList.remove("expanded");
                var image = gridCell.querySelector("img");
                if (image) {
                    image.style.maxWidth = "300px";
                    image.style.maxHeight = "200px";
                }
            }, 300);
        }
    }


    function trocarImagens(gridCell1, gridCell2) {
        var changePositionsCheckbox = document.getElementById("change-positions");
        if (changePositionsCheckbox.checked) {
            var image1 = gridCell1.querySelector("img");
            var image2 = gridCell2.querySelector("img");

            gridCell1.appendChild(image2);
            gridCell2.appendChild(image1);

            gridCell1.classList.toggle("selected");
            gridCell2.classList.toggle("selected");

            selectedImage = gridCell2;
        }
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