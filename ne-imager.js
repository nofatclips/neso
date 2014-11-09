"use strict"
// Canvas Module
angular.module("neCanvas", []).factory("neImager", ["$filter", "Data", "Settings", "Stile", "neSplitter", function ($filter, Data, Settings, Stile, split) {

    var inizialeMaiuscola = $filter("inizialeMaiuscola"),
        picture,
        link,
        canvas,
        context;
    var center = {
        x: 207,
        y: 625
    }, size = {
        x: 85,
        y: 96
    };
    var posizioneUltimaRiga;

    canvas = document.createElement('canvas');
    canvas.width = 414;
    canvas.height = 709;
    
    split.setMaxFontSize(18);
    split.setHeight(442);
    
    var setImmagineDaSalvare = function(img) {
        picture = img;
    }

    var setLinkPerSalvareImmagine = function(anchor) {
        link = anchor;
    }

    var setCanvasPerCreareImmagine = function(c) {
        canvas = c;
        setContext();
    }
    
    var setContext = function (ctx) {
        context = ctx || canvas.getContext('2d');
        split.setContext(context);
    }
    
    var clearCanvas = function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = Stile.backgroundColor;
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    var redrawImage = function() {
        context.drawImage(logoErranti, (center.x/2)-(size.x/2), center.y-(size.y/2)+15, size.x, size.y);
    }
    
    var redrawBackground = function() {
        context.drawImage(sfondoNeso, 0, 0);
    }
    
    var allineaTesto = function(testo, allineamento, x, y, size) {
        if (allineamento === "left") {
            context.textAlign = "left";
            context.fillText(testo, x, y, size);
        } else if (allineamento === "right") {
            context.textAlign = "right";
            context.fillText(testo, x+size, y, size);
        } else if (allineamento === "middle") {
            context.textAlign = "center";
            context.fillText(testo, x+size/2, y, size);
        }
    }
    
    var redrawTitle = function() {
        context.font = 'bold 20pt ' + Stile.font;
        context.fillStyle = Stile.color;
        context.textBaseline = 'alphabetic';
        allineaTesto (Data.ilTitolo.toUpperCase(), Settings.allineaTitolo, 20, 30, 374);
    }
    
    var redrawText = function() {
        context.font = 'normal 18pt ' + Stile.font;        
        context.fillStyle = Stile.color;
        context.textBaseline = 'alphabetic';
        split.setLeading(Settings.interlinea);
        var ampiezza = canvas.width - Settings.margine * 2;
        split.setWidth(ampiezza);
        split.setText(Data.ilRacconto);
        split.process();
        var lines = split.getLines();
        var h = split.getLineHeight();
        context.font = 'normal ' + split.getFontSize() + 'pt ' + Stile.font;
        lines.forEach(function(line, num) {
            posizioneUltimaRiga = 70 + num * h;
            allineaTesto(line.trim(), Settings.allineaRacconto, parseInt(Settings.margine,10), posizioneUltimaRiga, ampiezza);
        });
    }
    
    var redrawName = function() {
        context.font = 'italic '+ Math.min(20, 4 + split.getFontSize()) +'pt ' + Stile.font;
        context.fillStyle = Stile.color;
        context.textBaseline = 'alphabetic';
        var posizioneFirma = Math.min(posizioneUltimaRiga + split.getLineHeight() + 20, 540);
        allineaTesto(Data.laFirma, Settings.allineaFirma, 14, posizioneFirma, 390);
    }
    
    var redrawWords = function() {
        context.font = 'bold 20pt ' + Stile.font;
        context.fillStyle = Stile.color;
        context.textBaseline = 'middle';
        context.textAlign = "right";
        context.fillText(inizialeMaiuscola(Data.parola1), 155, center.y, 150);
        context.textAlign = "left";
        context.fillText(inizialeMaiuscola(Data.parola2), 254, center.y, 150);
    }
    
    var redrawNE = function() {
        context.font = 'normal 18pt ' + Stile.font;
        context.fillStyle = Stile.color;
        context.textBaseline = 'alphabetic';
        context.textAlign = "center";
        context.fillText("NarrantiErranti", center.x, 698);
    }
    
    var redrawSettimana = function() {
        if (!Data.laData) return;
        var y = 550;
        context.font = 'bold 20pt ' + Stile.font;
        context.fillStyle = "black";
        context.textBaseline = 'alphabetic';
        context.textAlign = "center";
        context.fillText("Settimana " + Data.laData, center.x-11, y-1);
        context.font = 'bold 20pt ' + Stile.font;
        context.fillStyle = "black";
        context.textBaseline = 'alphabetic';
        context.textAlign = "center";
        context.fillText("Settimana " + Data.laData, center.x-9, y+1);
        context.font = 'bold 20pt ' + Stile.font;
        context.fillStyle = "white";
        context.textBaseline = 'alphabetic';
        context.textAlign = "center";
        context.fillText("Settimana " + Data.laData, center.x-10, y);
    }
    
    var updateImage = function() {
        picture.src = canvas.toDataURL("image/jpeg");
        link.href = picture.src;
        link.download = (Data.ilTitolo || "senzatitolo") + ".jpeg";
    }
    
    var aggiorna = function() {
        clearCanvas();
        redrawBackground();
        redrawImage();
        redrawTitle();
        redrawText();
        //redrawName();
        //redrawWords();
        //redrawNE();
        redrawSettimana();
        updateImage();
    }
    
    setContext();
    var logoErranti = new Image();
    logoErranti.src = "erranti_sml.jpg";
    logoErranti.onload = aggiorna;
    
    var sfondoNeso = new Image();
    sfondoNeso.src = "neso.jpg";
    sfondoNeso.onload = aggiorna;
    
    return {
        "aggiorna": aggiorna,
        "setImage": setImmagineDaSalvare,
        "setLink": setLinkPerSalvareImmagine,
        "setCanvas": setCanvasPerCreareImmagine
    }

}]);