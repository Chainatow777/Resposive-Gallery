var selectedImage = null; // Variável para armazenar a imagem atualmente selecionada

document.addEventListener("DOMContentLoaded", function () {
    var grid = document.querySelector(".grid");
    var images = []; // Array para armazenar as imagens adicionadas
    var currentIndex = 0; // Índice da imagem atualmente expandida

    var plus = document.querySelector("#plus");

    document.addEventListener("mousemove", function (event) {
        var rect = plus.getBoundingClientRect();
        var centerX = rect.left + rect.width / 2 - window.pageXOffset;
        var centerY = rect.top + rect.height / 2 - window.pageYOffset;

        var mouseX = event.pageX;
        var mouseY = event.pageY;

        var radians = Math.atan2(mouseY - centerY, mouseX - centerX);
        var degree = radians * (180 / Math.PI);

        plus.style.transform = "rotate(" + degree + "deg)";
    });

    function adicionarBotaoFechar(gridCell) {
        var closeButton = document.createElement("div");
        closeButton.classList.add("close-button");
        closeButton.innerText = "X";
        closeButton.addEventListener("click", function (event) {
            event.stopPropagation();
            var image = gridCell.querySelector("img");
            var index = images.indexOf(image);
            if (index !== -1) {
                images.splice(index, 1);
            }
            gridCell.parentNode.removeChild(gridCell);
        });

        gridCell.appendChild(closeButton);
    }

    function adicionarArquivo(url) {
        var gridCell = document.createElement("div");
        gridCell.classList.add("grid-cell");
        gridCell.addEventListener("click", function () {
            selecionarImagem(this);
        });

        var image = new Image();
        image.onload = function () {
            gridCell.appendChild(image);
            if (document.getElementById("change-positions").checked) {
                adicionarBotaoFechar(gridCell);
            }
        };
        image.src = url;
        image.style.width = "100%";
        image.style.height = "auto";

        grid.appendChild(gridCell);

        // Adicionar a imagem ao array de imagens
        images.push(image);
    }

    var changePositionsCheckbox = document.getElementById("change-positions");
    changePositionsCheckbox.addEventListener("change", function () {
        var gridCells = document.querySelectorAll(".grid-cell");
        gridCells.forEach(function (gridCell) {
            if (changePositionsCheckbox.checked) {
                adicionarBotaoFechar(gridCell);
            } else {
                var closeButton = gridCell.querySelector(".close-button");
                if (closeButton) {
                    closeButton.parentNode.removeChild(closeButton);
                }
            }
        });
    });

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

            // Criar o container para os botões
            var buttonContainer = document.createElement("div");
            buttonContainer.classList.add("button-container");

            // Criar o botão de próxima imagem
            var nextButton = document.createElement("button");
            nextButton.innerText = "Próxima";
            nextButton.addEventListener("click", avancarImagem);
            buttonContainer.appendChild(nextButton);

            // Criar o botão de imagem anterior
            var prevButton = document.createElement("button");
            prevButton.innerText = "Anterior";
            prevButton.addEventListener("click", retrocederImagem);
            buttonContainer.appendChild(prevButton);

            // Adicionar o container de botões ao gridCell
            gridCell.appendChild(buttonContainer);

            setTimeout(function () {
                gridCell.classList.add("active");
            }, 10);
        }
    }

    function fecharImagem(gridCell) {
        var changePositionsCheckbox = document.getElementById("change-positions");
        if (!changePositionsCheckbox.checked) {
            gridCell.classList.remove("active");

            var buttonContainer = gridCell.querySelector(".button-container");
            if (buttonContainer) {
                buttonContainer.parentNode.removeChild(buttonContainer);
            }

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

            // Remover as imagens dos seus respectivos pais
            image1.parentNode.removeChild(image1);
            image2.parentNode.removeChild(image2);

            // Adicionar as imagens nos gridCells correspondentes
            gridCell1.appendChild(image2);
            gridCell2.appendChild(image1);

            // Atualizar a classe "selected" nos gridCells
            gridCell1.classList.toggle("selected");
            gridCell2.classList.toggle("selected");

            // Atualizar a variável selectedImage
            selectedImage = gridCell2;
        }
    }

    var icon = document.querySelector(".sidebar-icon");

    icon.addEventListener("click", function () {
        var fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.multiple = true;

        fileInput.addEventListener("change", function (event) {
            var files = event.target.files;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];

                if (file.type.startsWith("image/")) {
                    var url = URL.createObjectURL(file);
                    adicionarArquivo(url);
                }
            }
        });

        fileInput.click();
    });

    function avancarImagem() {
        currentIndex++; // Avança para a próxima imagem
        if (currentIndex >= images.length) {
            currentIndex = 0; // Volta para a primeira imagem se atingir o final do array
        }
        expandirImagem(images[currentIndex].parentNode);
    }

    function retrocederImagem() {
        currentIndex--; // Retrocede para a imagem anterior
        if (currentIndex < 0) {
            currentIndex = images.length - 1; // Volta para a última imagem se estiver no início do array
        }
        expandirImagem(images[currentIndex].parentNode);
    }
});