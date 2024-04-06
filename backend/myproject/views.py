# %%
import pandas as pd
import numpy as np
import requests
import pandas as pd

from django.http import HttpResponse, JsonResponse
from scipy.stats import stats, chi2_contingency
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
import pingouin as pg
from rest_framework.decorators import api_view
from rest_framework.response import Response
import PyPDF2
from io import BytesIO


# %%

def find_related_group(df, features, corr_threshold=0.6):
    """Identifies a group of features that are correlated above a threshold.

    Args:
        df (pandas.DataFrame): The DataFrame containing the features.
        features (list): A list of feature names to start with.
        corr_threshold (float): The minimum correlation for inclusion in the group.

    Returns:
        list: A list of correlated feature names (including the starting features).
    """
    related = set(features)  # Start with the original features
    corr_matrix = df[features].corr()  # Calculate correlation matrix

    # Loop through each feature in the list
    for feat in features:
        # Loop through all other features to check correlation
        for f in corr_matrix.columns:
            # Skip if same feature or already in related set
            if f == feat or f in related:
                continue
            # Check correlation against current feature
            if abs(corr_matrix.loc[feat, f]) >= corr_threshold:
                related.add(f)  # Add correlated feature to set

    return list(related)  # Convert set back to list and return


# %%
def point_biserial_correlation(categorical, numerical):
    """Calculates the point-biserial correlation coefficient.

    Args:
        categorical (array-like): Binary categorical variable.
        numerical (array-like): Continuous numerical variable.

    Returns:
        float: Point-biserial correlation coefficient.
    """

    corr, p_value = pointbiserialr(categorical, numerical)
    return corr  

# %%
def analyze_correlation(df, feature1, feature2):
    """
    Performs correlation analysis between two numerical features.

    Args:
        df (pandas.DataFrame): The DataFrame containing the features.
        feature1 (str): Name of the first feature.
        feature2 (str): Name of the second feature.

    Returns:
        dict: A dictionary containing correlation results.
    """

    # Data extraction and basic checks
    data1 = df[feature1]
    data2 = df[feature2]

    if not pd.api.types.is_numeric_dtype(data1) or not pd.api.types.is_numeric_dtype(data2):
        print("Error: Both features must be numeric.")
        return None

    # Correlation, Visualization, and Regression
    correlation, p_value = stats.pearsonr(data1, data2)

    print(f"Pearson's Correlation Coefficient: {correlation:.4f}")
    print(f"p-value: {p_value:.4f}")

    if p_value < 0.05:
        print("The correlation is statistically significant.")

        # Scatter Plot with Regression Line 
        plt.scatter(data1, data2)
        m, c = np.polyfit(data1, data2, 1)  
        plt.plot(data1, m * data1 + c, color='red')  
        plt.xlabel(feature1)
        plt.ylabel(feature2)
        plt.title(f"Correlation between {feature1} and {feature2}")
        plt.show()

    # Hypothesis based on strength 
    if abs(correlation) >= 0.8:
        print("The correlation is strong. Consider linear regression.")
    else:
        print("The correlation is moderate or weak. Explore curve fitting.")

    return {
        "feature1": feature1,
        "feature2": feature2,
        "correlation": correlation,
        "p_value": p_value,
        "strength": "strong" if abs(correlation) >= 0.8 else "moderate_or_weak"
    }


# %%

def run_to_analyze(df,column1,column2):

    # %%
    # Perform correlation analysis

    correlation_results = analyze_correlation(df, column1, column2)

    # Prepare input data for NLP model
    input_text = f"Correlation results:\n{correlation_results}"

    # Load pre-trained NLP model locally (example using Hugging Face's Transformers library)
    from transformers import pipeline

    nlp_model = pipeline("text-generation", model="gpt2")

    # Generate additional insights using the NLP model
    additional_insights = nlp_model(input_text, max_length=100, num_return_sequences=1)[0]['generated_text']

    # Combine original text output and additional insights
    combined_output = f"Original correlation analysis:\n{correlation_results}\n\nAdditional insights:\n{additional_insights}"

    # Print or display the combined output
    return combined_output

@api_view(['POST'])
def process_data(request):
    column = 0
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
    
        
        analyzeData = run_to_analyze(selected_data,selected_columns[column],selected_columns[column+1])

        if len(analyzeData) > 0:
            return Response({'message': analyzeData}, status=200)
        else:
            return Response({'message': selected_data}, status=200)  # No charts available
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
        elif 'application/pdf' in content_type:
            pdf_data = response.content
            pdf_reader = PyPDF2.PdfFileReader(BytesIO(pdf_data))
            num_pages = pdf_reader.numPages
            text_content = []
            for page_num in range(num_pages):
                page = pdf_reader.getPage(page_num)
                text_content.append(page.extractText())
            # Convert extracted text to DataFrame (example)
            df = pd.DataFrame({'Text': text_content})
        else:
            return HttpResponse("Unsupported file format")
        
        return df
    else:
        return HttpResponse("Failed to download file")
