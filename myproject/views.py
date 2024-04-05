import os
import requests
import pandas as pd

from django.http import HttpResponse, JsonResponse

def read_from_url(request):
    if request.method == 'GET':
        data = download_and_read_file(request=request)
        return JsonResponse({'message': data}, status=201) #success response
    return JsonResponse({'error': 'Method not allowed'}, status=405) #bad request method

def download_and_read_file(request):
    # URL of the file
    file_url = "https://firebasestorage.googleapis.com/v0/b/dynamic-dashboard-deaab.appspot.com/o/supermarket_sales%20-%20Sheet1.csv?alt=media&token=f30214f2-a68a-42e0-9610-291a52aeb5d9"
    # file_url = "https://firebasestorage.googleapis.com/v0/b/dynamic-dashboard-deaab.appspot.com/o/supermarket_sales%20-%20Sheet1.xlsx?alt=media&token=4c8de51e-0465-483d-83df-faad44249402"

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
        
        return df.to_json(orient='records')
    else:
        return HttpResponse("Failed to download file")
