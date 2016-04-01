$(function() {

	$('#file_selector').on('click', function(e) {
		$('#my_file').trigger('click');
	});

	$('#my_file').on('change', function() {
		$('#file_selector').html($(this).val());
	});

});