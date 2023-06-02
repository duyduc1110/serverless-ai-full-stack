$(document).ready(function() {
  
   $('#next-to-audience').prop('disabled', true);
  
   $('#brand-page form').on('input', function(){
      if($('#brand').val()){
         $('#next-to-audience').prop('disabled', false);
      }else{
         $('#next-to-audience').prop('disabled', true);
      }
   });
  
   $('#add-audience').click(function(e) {
      e.preventDefault();
      const audienceGroup = $('<div class="audience-group"><input class="audience" type="text" name="audience[]"><button class="remove-audience" type="button"><i class="fa fa-trash"></i></button><br></div>');
      audienceGroup.find('.remove-audience').click(function(e) {
         e.preventDefault();
         $(this).closest('.audience-group').remove();
      });
      $('#audience-container').append(audienceGroup);
   });
   
   $('.remove-audience').click(function(e) {
      e.preventDefault();
      $(this).closest('.audience-group').remove();
   });
   
   $('#next-to-audience').click(function(e){
     e.preventDefault();
     $('#brand-page').hide();
     $('#audience-page').show();
   });
   
   $('#next-to-image').click(function(e){
     e.preventDefault();
     const brand = $('#brand').val();
     const audience = $('.audience').map(function() { return $(this).val(); }).get();
     
     $.post('/generate', {brand, audience}, function(data){
       const images = data.images.map(image => `<img src="data:image/jpeg;base64,${image}"/>`).join('');
       $('#image-container').html(images);
       $('#audience-page').hide();
       $('#image-page').show();
     });
   });
});
