$(document).ready(function() {
   let audienceCount = 1;
 
   $('#next-to-audience').click(function() {
     $('#brand-page').hide();
     $('#audience-page').show();
   });
 
   $('#next-to-image').click(function() {
     $('#audience-page').hide();
     $('#image-page').show();
     // get the brand and audience descriptions from the input fields
     let brand = $('#brand').val();
     let audience = $('.audience').map(function() {
       return $(this).val();
     }).get();
     // send a POST request to the /generate route with the form data
     $.ajax({
       url: '/generate',
       type: 'POST',
       data: {
         brand: brand,
         audience: audience
       },
       success: function(data) {
         // loop through the image data and create image elements
         for (let i = 0; i < data.images.length; i++) {
           // create a label element with the audience description
           let label = $('<label/>', {
             'text': 'User ' + (i + 1) + ': ' + audience[i]
           });
           // create an image element with the base64 encoded image data
           let image = $('<img/>', {
             'src': 'data:image/png;base64,' + data.images[i],
             'alt': 'Image for user ' + (i + 1)
           });
           // append the label and image elements to the #image-container div
           $('#image-container').append(label).append(image).append('<br>');
         }
       },
       error: function(error) {
         // handle the error
         alert(error.responseJSON.error);
       }
     });
   });
 
   $('#add-audience').click(function() {
     audienceCount++;
     let audienceGroup = $('<div/>', {
       'class': 'audience-group'
     });
     let label = $('<label/>', {
       'text': 'User ' + audienceCount + ':'
     });
     let input = $('<input/>', {
       'class': 'audience',
       'type': 'text',
       'name': 'audience[]',
       'placeholder': 'input text'
     });
     let removeButton = $('<button/>', {
       'class': 'remove-audience',
       'type': 'button'
     });
     let icon = $('<i/>', {
       'class': 'fa fa-trash'
     });
     removeButton.append(icon);
     audienceGroup.append(label).append('<br>').append(input).append(removeButton).append('<br>');
     $('#audience-container').append(audienceGroup);
   });
 
   $(document).on('click', '.remove-audience', function() {
     $(this).closest('.audience-group').remove();
     audienceCount--;
     $('.audience-group label').each(function(index) {
       $(this).text('User ' + (index + 1) + ':');
     });
   });
 });
