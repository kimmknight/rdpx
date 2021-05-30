function encodeimagefromfile(input) {
  let file = input.files[0];

  let reader = new FileReader();

  reader.readAsDataURL(file);

  reader.onload = function() {
    var result = reader.result;
    document.getElementById("imagesrc").value = result;
    loadimagetopage(result);
  };

  reader.onerror = function() {
    console.log(reader.error);
  };

}

function loadimagetopage(imagebase64) {
  document.getElementById("smallappimg").setAttribute("src", imagebase64);
}