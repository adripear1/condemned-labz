document.addEventListener('DOMContentLoaded', function() {
    const subscriptionToggleMain = document.querySelector('.save_toggle-main');
    const subify_inputs = document.querySelector('.save_toggle');
    const priceBox = document.querySelector('.price__regular .price-item--regular');
    
    // Find the price block under the title (in the product info section)
    const priceBlock = document.querySelector('[id^="price-"]');
    const priceBlockPriceItem = priceBlock ? priceBlock.querySelector('.price-item--regular') : null;
    
    const initialPrice = priceBox ? priceBox.textContent : '';
    const initialPriceBlockPrice = priceBlockPriceItem ? priceBlockPriceItem.textContent : '';
    const mainPrice = Number(document.querySelector('product-info').getAttribute('data-price').replace('$', '').replace(',', ''));
    
    setTimeout(() => {
      subify_inputs.addEventListener('change', (event) => {
        if (event.target.checked) {
          const subscriptionBox =  document.querySelector('.rc-radio.subscription-radio');
          subscriptionBox.click();
          const subscriptionBoxPrice = subscriptionBox.querySelector('.rc-radio__price').textContent;
          
          // Update the price box
          if (priceBox) {
            priceBox.textContent = subscriptionBoxPrice + ' USD';
          }
          
          // Update the price block under the title
          if (priceBlockPriceItem) {
            priceBlockPriceItem.textContent = subscriptionBoxPrice;
          }
          
          const upsellPriceBtn = document.querySelector('.upsell_btn .save');
          if(upsellPriceBtn){
            const initialUpsellprice = Number(upsellPriceBtn.getAttribute('data-save'));
            const subscriptionPrice = Number(subscriptionBoxPrice.replace('$', '').replace(',', ''));
            
            console.log(initialUpsellprice, initialPrice,subscriptionBoxPrice, subscriptionPrice ) 
            const thePrice = initialUpsellprice - mainPrice + subscriptionPrice;
            upsellPriceBtn.textContent = `$${thePrice}`;
            upsellPriceBtn.setAttribute('data-save', thePrice); 
          }
        } else {
          document.querySelector('.rc-radio.onetime-radio').click();
          const subscriptionBox =  document.querySelector('.rc-radio.subscription-radio');
          const subscriptionBoxPrice = subscriptionBox.querySelector('.rc-radio__price').textContent;
          
          // Restore the original price
          if (priceBox) {
            priceBox.textContent = initialPrice;
          }
          
          // Restore the price block under the title
          if (priceBlockPriceItem) {
            priceBlockPriceItem.textContent = initialPriceBlockPrice;
          }
          
          const upsellPriceBtn = document.querySelector('.upsell_btn .save');
          if(upsellPriceBtn){
            const initialUpsellprice = Number(upsellPriceBtn.getAttribute('data-save'));
            const subscriptionPrice = Number(subscriptionBoxPrice.replace('$', '').replace(',', ''));
            
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
        
        // Listen for Recharge widget price changes
        const observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
              // Check if subscription radio is selected
              const subscriptionRadio = document.querySelector('.rc-radio.subscription-radio');
              const onetimeRadio = document.querySelector('.rc-radio.onetime-radio');
              
              if (subscriptionRadio && subscriptionRadio.classList.contains('rc-radio--selected')) {
                const subscriptionPrice = subscriptionRadio.querySelector('.rc-radio__price');
                if (subscriptionPrice && priceBlockPriceItem) {
                  const priceText = subscriptionPrice.textContent.trim();
                  priceBlockPriceItem.textContent = priceText;
                }
              } else if (onetimeRadio && onetimeRadio.classList.contains('rc-radio--selected')) {
                // Restore original price when one-time is selected
                if (priceBlockPriceItem && initialPriceBlockPrice) {
                  priceBlockPriceItem.textContent = initialPriceBlockPrice;
                }
              }
            }
          });
        });
        
        // Observe the recharge widget for changes
        if (rechargeWidget) {
          observer.observe(rechargeWidget, {
            childList: true,
            subtree: true,
            characterData: true
          });
          
          // Also listen for direct clicks on Recharge radio buttons
          const subscriptionRadio = document.querySelector('.rc-radio.subscription-radio');
          const onetimeRadio = document.querySelector('.rc-radio.onetime-radio');
          
          if (subscriptionRadio) {
            subscriptionRadio.addEventListener('click', function() {
              setTimeout(() => {
                const subscriptionPrice = subscriptionRadio.querySelector('.rc-radio__price');
                if (subscriptionPrice && priceBlockPriceItem) {
                  const priceText = subscriptionPrice.textContent.trim();
                  priceBlockPriceItem.textContent = priceText;
                }
              }, 100);
            });
          }
          
          if (onetimeRadio) {
            onetimeRadio.addEventListener('click', function() {
              setTimeout(() => {
                if (priceBlockPriceItem && initialPriceBlockPrice) {
                  priceBlockPriceItem.textContent = initialPriceBlockPrice;
                }
              }, 100);
            });
          }
        }
      }
   }, 2500)
 });