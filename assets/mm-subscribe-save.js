document.addEventListener('DOMContentLoaded', function() {
    const subscriptionToggleMain = document.querySelector('.save_toggle-main');
    const subify_inputs = document.querySelector('.save_toggle');
    const priceBox = document.querySelector('.price__regular .price-item--regular');
    const initialPrice = priceBox.textContent;
    const mainPrice = Number(document.querySelector('product-info').getAttribute('data-price').replace('$', ''));
    setTimeout(() => {
      subify_inputs.addEventListener('change', (event) => {
        if (event.target.checked) {
          const subscriptionBox =  document.querySelector('.rc-radio.subscription-radio');
          subscriptionBox.click();
          const subscriptionBoxPrice = subscriptionBox.querySelector('.rc-radio__price').textContent
          priceBox.textContent = subscriptionBoxPrice + ' USD';
          const upsellPriceBtn = document.querySelector('.upsell_btn .save');
          if(upsellPriceBtn){
            const initialUpsellprice = Number(upsellPriceBtn.getAttribute('data-save'));
            const subscriptionPrice = Number(subscriptionBoxPrice.replace('$', ''));
            
            console.log(initialUpsellprice, initialPrice,subscriptionBoxPrice, subscriptionPrice ) 
            const thePrice = initialUpsellprice - mainPrice + subscriptionPrice;
            upsellPriceBtn.textContent = `$${thePrice}`;
            upsellPriceBtn.setAttribute('data-save', thePrice); 
          }
        } else {
          document.querySelector('.rc-radio.onetime-radio').click();
          const subscriptionBox =  document.querySelector('.rc-radio.subscription-radio');
          const subscriptionBoxPrice = subscriptionBox.querySelector('.rc-radio__price').textContent
          priceBox.textContent = initialPrice;
          const upsellPriceBtn = document.querySelector('.upsell_btn .save');
          if(upsellPriceBtn){
            const initialUpsellprice = Number(upsellPriceBtn.getAttribute('data-save'));
            const subscriptionPrice = Number(subscriptionBoxPrice.replace('$', ''));
            
            console.log(initialUpsellprice, initialPrice,subscriptionBoxPrice, subscriptionPrice )
            upsellPriceBtn.textContent = `$${initialUpsellprice - subscriptionPrice  + mainPrice}`;
            upsellPriceBtn.setAttribute('data-save', (initialUpsellprice - subscriptionPrice + mainPrice)); 
          }
        }
      });
    }, 1000);
   setTimeout(() => {
       const rechargeWidget = document.querySelector('.recharge-subscription-widget .rc-widget');
      if(rechargeWidget){
        subscriptionToggleMain.style.display = 'flex';
      }
   }, 2500)
 });