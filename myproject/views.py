import os
import requests
import pandas as pd

from django.http import HttpResponse, JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def process_data(request):
    if request.method == 'POST':
        # Get the file URL and selected columns from the request body
        file_url = request.data.get('fileUrl')
        selected_columns = request.data.get('selectedColumns', [])

        if not file_url:
            return Response({'error': 'File URL is required'}, status=400)

        # Extract only the selected columns from the DataFrame
        data = download_and_read_file(file_url)
        
        if data is None:
            return Response({'error': 'Failed to read file'}, status=500)

        selected_data = data[selected_columns]
        
        return Response({'message': selected_data}, status=200)
    else:
        return Response({'error': 'Invalid request method'}, status=405)

def download_and_read_file(file_url):

    response = requests.get(file_url)
    
    if response.status_code == 200:
        # Determine file format based on content type
        content_type = response.headers['Content-Type']

        if 'application/json' in content_type:
            df = pd.read_json(response.content)
        elif 'text/csv'or 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' in content_type:
            df = pd.read_csv(file_url)
        else:
            return HttpResponse("Unsupported file format")
        
        return df
    else:
        return HttpResponse("Failed to download file")
