let ratingBtn = document.querySelectorAll('.btn-secondary');

let rating = undefined;

let numRating = document.querySelector('.num-rating');


for(let i=0; i<ratingBtn.length; i++) {
  ratingBtn[i].addEventListener('click', () => {
    rating = ratingBtn[i].value;
    numRating.value = rating;
    console.log(rating);

    for(let j=0; j<ratingBtn.length; j++) {
      ratingBtn[j].classList.remove('active-btn');
    }

    ratingBtn[i].classList.add('active-btn');
  })
};



// let reviewBtn = document.querySelector('.add-review');
// let reviewForm = document.querySelector('.review-form');
// let flag = false;

// reviewBtn.addEventListener('click', () => {
//   if(flag == false) {
//     reviewForm.style.display = 'block';
//     flag = true;
//   } else {
//     reviewForm.style.display = 'none';
//     flag = false;
//   }
// });

let textArea = document.querySelector('.review-textarea');


