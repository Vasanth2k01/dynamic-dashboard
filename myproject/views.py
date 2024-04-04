from django.http import JsonResponse

def data_submission_view(request):
    if request.method == 'GET':
        # Parse and process request data
        # data = request.POST.get('data')  # Assuming data is sent as form data
        
        # Process the data (e.g., save to database)
        # ...

        # Return a success response
        return JsonResponse({'message': 'Data submitted successfully'}, status=201)

    # Return a bad request response if method is not POST
    return JsonResponse({'error': 'Method not allowed'}, status=405)
