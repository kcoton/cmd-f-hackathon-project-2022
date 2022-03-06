  // checkbox search query
  let filters = "";
  const glutenCheck = document.getElementById("gluten");
  const veganCheck = document.getElementById("vegan");
  const halalCheck = document.getElementById("halal");
  const mandarinCheck = document.getElementById("mandarin");
  const koreanCheck = document.getElementById("korean");
  const japaneseCheck = document.getElementById("japanese");

  glutenCheck?.addEventListener("change", () => {
    if (veganCheck?.ariaChecked) {
      filters += "vegan ";
      console.log("vegan");
    }
  });
  if (glutenCheck?.ariaChecked) {
    filters += "gluten ";
  }
  if (halalCheck?.ariaChecked) {
    filters += "halal ";
  }
  if (mandarinCheck?.ariaChecked) {
    filters += "mandarin ";
  }
  if (koreanCheck?.ariaChecked) {
    filters += "korean ";
  }
  if (japaneseCheck?.ariaChecked) {
    filters += "japanese ";
  }
  filters += "restaurants";
  let el = document.querySelector(filters) as HTMLInputElement;