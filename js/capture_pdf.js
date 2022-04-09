


function capture(is_pdf=true){

    doc = new jsPDF({
        orientation: 'l',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts:true
       }); //https://artskydj.github.io/jsPDF/docs/jsPDF.html
    document.querySelector("#out").innerHTML="";

    element = document.querySelector("#capture");
    const options = { width: 1005 , height: 1000 } ;//scale: 1 } ; //https://gitter.im/niklasvh/html2canvas?at=57a8978c16b0696856a343f5
    html2canvas(element,options).then(canvas => {
        //<!-- width: 750px; height: 200px;-->
        //,{windowWidth: element.scrollWidth, windowHeight: element.scrollHeight}
        // https://html2canvas.hertzen.com/faq.html

        if(is_pdf){
            var base64 = canvas.toDataURL();
            
            base64 = base64.replace('data:image/png;base64,','');

            //doc.setFontSize(40); //https://artskydj.github.io/jsPDF/docs/jsPDF.html#setFontSize
            doc.addImage(base64, 'PNG', 0,0);
            doc.save('image.pdf');
        }else{
            document.querySelector("#out").appendChild(canvas)
            var base64image = canvas.toDataURL("image/png");
            console.log(""+base64image);
        }
    });
}