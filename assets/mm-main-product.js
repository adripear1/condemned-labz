let cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
const cartBundler = document.querySelectorAll('.rts_upsell--main button');
const checkboxes = document.querySelectorAll('.bundler-checkbox');
const mainProductInput = document.querySelector('.product-form');
const inputId = mainProductInput.querySelector('input[name="id"]');
const selectedValues = [];
const variantSelectors = document.querySelectorAll('.upsell--variant__selector select');

variantSelectors.forEach((variant) => {
  variant.addEventListener('change', (e) => {
    const parentWrapper = variant.closest('.rts_upsell--product');
    const checkbox = parentWrapper.querySelector('.bundler-checkbox');
    const index = selectedValues.findIndex((item)=>{
      return item == checkbox.value;
    });
    if (index !== -1) {
      selectedValues.splice(index, 1);
    }
    selectedValues.push(Number(variant.value));
    checkbox.value = variant.value;
    console.log(selectedValues)
  })
});

// {% comment %} 
//  selectedValues[0] = Number(inputId.value);
// inputId.addEventListener('change', (e) => {
//   selectedValues[0] = Number(inputId.value);
// }); {% endcomment %}
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', (event) => {
      let initialPrice = Number(document.querySelector('.upsell_btn .save').getAttribute('data-save'));
      let comparePrice = Number(document.querySelector('.upsell_btn .compare').getAttribute('data-compare'));
       console.log('initialPrice:',initialPrice, "comparePrice:",comparePrice)
      const checkboxValue = event.target.value;
      console.log("selectedValues:",checkboxValue)
      if (event.target.checked) {
        event.target.closest('.rts_upsell--product').classList.add('active');
        const index = selectedValues.findIndex((item)=>{
          return item == checkboxValue;
        });
        if (index === -1) {
          selectedValues.push(Number(checkboxValue));
        }
        console.log('save:',event.target.dataset.save, "compare:",event.target.dataset.compare)
        initialPrice += Number(event.target.dataset.save);
        comparePrice += Number(event.target.dataset.compare);
      } else {
        console.log('save:',event.target.dataset.save, "compare:",event.target.dataset.compare);
        event.target.closest('.rts_upsell--product').classList.remove('active');
          initialPrice -= Number(event.target.dataset.save);
          comparePrice -= Number(event.target.dataset.compare);
          const index = selectedValues.findIndex((item)=>{
            return item == checkboxValue;
          });
          if (index !== -1) {
            selectedValues.splice(index, 1);
        }
      }
      initialPrice = initialPrice.toFixed(2);
      comparePrice = comparePrice.toFixed(2)
      console.log('initialPrice:', initialPrice,'comparePrice:',comparePrice);
      document.querySelector('.upsell_btn .save').textContent = `$${initialPrice}`;
      document.querySelector('.upsell_btn .compare').textContent = `$${comparePrice}`;
      document.querySelector('.upsell_btn .save').setAttribute('data-save',initialPrice);
      document.querySelector('.upsell_btn .compare').setAttribute('data-compare',comparePrice);
      if(comparePrice > initialPrice) {
       document.querySelector('.upsell_btn .compare').style.display = 'inline';
      }else{
       document.querySelector('.upsell_btn .compare').style.display = 'none';
      }
      if(selectedValues.length  > 0){
        document.querySelector('.upsell_btn').removeAttribute('disabled');
      }else{
        document.querySelector('.upsell_btn').setAttribute('disabled','disabled');
      }
    });
  });
 
cartBundler.forEach(el => {el.addEventListener('click', function (e) {
    document.querySelector('.product__info-wrapper .product-form__buttons .product-form__submit.button').click();
    setTimeout(() => {
           const formDataa = new FormData();
           selectedValues.map((item , i) => (formDataa.append(`items[${i}][id]`, item)));
            if (cart) {
              formDataa.append(
                'sections',
                cart.getSectionsToRender().map((section) => section.id)
              );
              formDataa.append('sections_url', window.location.pathname);
              cart.setActiveElement(document.activeElement);
            }
           console.log(formDataa);
            fetch('/cart/add.js', {
              method: 'POST',
              body: formDataa
            })
              .then(response => response.json())
              .then(response => {
                   console.log(response);
                   cart.renderContents(response);
                   cart.classList.remove('is-empty');
              })
              .catch((error) => {
                console.error('Error:', error);
             });
          },300)
})});