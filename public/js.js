
document.querySelectorAll('.quantity-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault(); // Empêche la soumission du formulaire classique
  
      const formData = new FormData(form);
      const itemId = form.getAttribute('data-id');
      const action = formData.get('action');
  
      try {
        const response = await fetch(`/update-quantity/${itemId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            action: action
          })
        });
  
        const result = await response.json();
  
        if (result.success) {
          const quantitySpan = form.querySelector('.quantity');
          quantitySpan.textContent = `Quantité : ${result.newQuantity}`;
  
      
          if (result.newQuantity <= 0) {
            const li = form.closest('li');
            const aAcheterList = document.querySelector('.a-acheter ul');
            aAcheterList.appendChild(li);
          }
        } else {
          console.error(result.message);
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la quantité:', error);
      }
    });
  });