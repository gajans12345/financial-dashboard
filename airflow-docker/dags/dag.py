from airflow import DAG
from airflow.providers.postgres.operators.postgres import PostgresOperator
from datetime import datetime, timedelta

# Default arguments for the DAG
default_args = {
    'owner': 'coder2j',
    'retries': 5,
    'retry_delay': timedelta(minutes=5),
}

# Define the DAG
with DAG(
    dag_id='dag_with_postgres_operator_v02',  # Unique identifier for the DAG
    default_args=default_args,  # Default args passed to the DAG
    start_date=datetime(2024, 12, 4),  # Start date of the DAG
    schedule_interval=None,  # Disable automatic scheduling
    catchup=False,  # Ensures the DAG doesn't backfill
) as dag:

    # Table creation tasks
    task1 = PostgresOperator(
        task_id='create_prices_table',
        postgres_conn_id='postgres_localhost',  # Connection ID from Airflow UI
        sql="""
            CREATE TABLE IF NOT EXISTS Pricees (
                Price SERIAL PRIMARY KEY,
                Year SERIAL NOT NULL,
                Company VARCHAR(255) NOT NULL
            );
        """
    )

    create_stacked_table = PostgresOperator(
        task_id='create_stacked_table',
        postgres_conn_id='postgres_localhost',  # Connection ID from Airflow UI
        sql="""
            CREATE TABLE IF NOT EXISTS Stacked (
                CostofRevenue BIGSERIAL PRIMARY KEY,
                Year VARCHAR(4) NOT NULL,
                OperatingExpense BIGSERIAL NOT NULL,
                ResearchandDevelopment BIGSERIAL NOT NULL,
                SGA BIGSERIAL NOT NULL,
                Company VARCHAR(255) NOT NULL
            );
        """
    )

    create_ratio_table = PostgresOperator(
        task_id='create_ratio_table',
        postgres_conn_id='postgres_localhost',  # Connection ID from Airflow UI
        sql="""
            CREATE TABLE IF NOT EXISTS Ratio (
                PayoutRatio DECIMAL PRIMARY KEY,
                ForwardPE DECIMAL NOT NULL,
                TrailingPE DECIMAL NOT NULL,
                ShortRatio DECIMAL NOT NULL,
                QuickRatio DECIMAL NOT NULL,
                CurrentRatio DECIMAL NOT NULL,
                PegRatio DECIMAL NOT NULL,
                Company VARCHAR(255) NOT NULL
            );
        """
    )

    create_key_table = PostgresOperator(
        task_id='create_key_table',
        postgres_conn_id='postgres_localhost',  # Connection ID from Airflow UI
        sql="""
            CREATE TABLE IF NOT EXISTS Keyy (
                CurrentPrice DECIMAL PRIMARY KEY,
                DividendRate DECIMAL NOT NULL,
                BidAskSpread DECIMAL NOT NULL,
                FiftyTwoWeekHigh DECIMAL NOT NULL,
                FiftyTwoWeekLow DECIMAL NOT NULL,
                MarketCap DECIMAL NOT NULL,
                ROE DECIMAL NOT NULL,
                PegRatio DECIMAL NOT NULL,
                Company VARCHAR(255) NOT NULL
            );
        """
    )

    create_curr_table = PostgresOperator(
        task_id='create_curr_table',
        postgres_conn_id='postgres_localhost',  # Connection ID from Airflow UI
        sql="""
            CREATE TABLE IF NOT EXISTS Curr (
                ShortTerm DECIMAL PRIMARY KEY,
                Receivables DECIMAL NOT NULL,
                Inventory DECIMAL NOT NULL,
                HedgingAssetsCurrently DECIMAL NOT NULL,
                OtherCurrentAssets DECIMAL NOT NULL,
                Company VARCHAR(255) NOT NULL
            );
        """
    )

    create_noncurr_table = PostgresOperator(
        task_id='create_noncurr_table',
        postgres_conn_id='postgres_localhost',  # Connection ID from Airflow UI
        sql="""
            CREATE TABLE IF NOT EXISTS NonCurr (
                PPE DECIMAL PRIMARY KEY,
                Intangibles DECIMAL NOT NULL,
                Investments DECIMAL NOT NULL,
                OtherNonCurrentAssets DECIMAL NOT NULL,
                Company VARCHAR(255) NOT NULL
            );
        """
    )


    create_flow_table = PostgresOperator(
        task_id='create_flow_table',
        postgres_conn_id='postgres_localhost',  # Connection ID from Airflow UI
        sql="""
            CREATE TABLE IF NOT EXISTS Flow (
                FreeCashFlow NUMERIC(15,1)  PRIMARY KEY,
                CapitalExpenditure NUMERIC(15,1) NOT NULL,
                Year VARCHAR(4) NOT NULL,
                Company VARCHAR(4) NOT NULL
            );
        """
    )

    # Data insertion tasks
    task2 = PostgresOperator(
        task_id='insert_into_prices_table',
        postgres_conn_id='postgres_localhost',  # Connection ID from Airflow UI
        sql="""
            INSERT INTO Pricees (Price, Year, Company)
            VALUES
                (41.167, 2014, 'Microsoft'),
                (38.765, 2015, 'Microsoft'),
                (49.549, 2016, 'Microsoft'),
                (66.172, 2017, 'Microsoft'),
                (94.660, 2018, 'Microsoft'),
                (124.150, 2019, 'Microsoft'),
                (186.04, 2020, 'Microsoft'),
                (268.531, 2021, 'Microsoft'),
                (263.749, 2022, 'Microsoft'),
                (311.033, 2023, 'Microsoft'),
                (417.528, 2024, 'Microsoft');

        """
    )

    insert_into_stacked_table = PostgresOperator(
        task_id='insert_into_stacked_table',
        postgres_conn_id='postgres_localhost',  # Connection ID from Airflow UI
        sql="""
            INSERT INTO Stacked (CostofRevenue,Year, OperatingExpense, ResearchandDevelopment, SGA, Company)
            VALUES
                (52232000000.0, 2021, 5107000000.0, 7575000000.0, 171008000000.0, 'Microsoft'),
                (62650000000.0, 2022, 5900000000.0, 7575000000.0, 171008000000.0, 'Microsoft'),
                (65863000000.0, 2023, 7575000000.0, 7575000000.0, 171008000000.0, 'Microsoft'),
                (74114000000.0, 2024, 7609000000.0, 7609000000.0, 171008000000.0, 'Microsoft');
        """
    )

    insert_into_ratio_table = PostgresOperator(
        task_id='insert_into_ratio_table',
        postgres_conn_id='postgres_localhost',  # Connection ID from Airflow UI
        sql="""
            INSERT INTO Ratio (PayoutRatio, ForwardPE, TrailingPE, ShortRatio, QuickRatio, CurrentRatio, PegRatio, Company)
            VALUES
                (0.2477, 28.430958, 35.37107, 3.28, 1.163, 1.301, 2.2141, 'Microsoft');
        """
    )

    insert_into_key_table = PostgresOperator(
        task_id='insert_into_key_table',
        postgres_conn_id='postgres_localhost',  # Connection ID from Airflow UI
        sql="""
            INSERT INTO Keyy (CurrentPrice, DividendRate, BidAskSpread, FiftyTwoWeekHigh, FiftyTwoWeekLow, MarketCap, ROE, PegRatio, Company)
            VALUES
                (427.99, 3.32, 22.19999, 468.35, 362.9, 3182054342656, 0.35604, 2.2141, 'Microsoft');
        """
    )

    insert_into_curr_table = PostgresOperator(
        task_id='insert_into_curr_table',
        postgres_conn_id='postgres_localhost',  # Connection ID from Airflow UI
        sql="""
            INSERT INTO Curr (ShortTerm, Receivables, Inventory, HedgingAssetsCurrently, OtherCurrentAssets, Company)
            VALUES
                (47.3, 35.6, 0.8, 0.0075, 16.3, 'Microsoft');
        """
    )

    insert_into_noncurr_table = PostgresOperator(
        task_id='insert_into_noncurr_table',
        postgres_conn_id='postgres_localhost',  # Connection ID from Airflow UI
        sql="""
            INSERT INTO NonCurr (PPE, Intangibles, Investments, OtherNonCurrentAssets, Company)
            VALUES
                (43.9, 41.7, 4.1, 10.3, 'Microsoft');
        """
    )
    microsoft_cash1 = {' Free Cash Flow ': 74071000000.0, ' Capital Expenditure ': -44477000000.0}
    microsoft_cash2 = {' Free Cash Flow ': 59475000000.0, ' Capital Expenditure ': -28107000000.0}
    microsoft_cash3 = {' Free Cash Flow ': 65149000000.0, ' Capital Expenditure ': -23886000000.0}
    microsoft_cash4 = {' Free Cash Flow ': 56118000000.0, ' Capital Expenditure ': -20622000000.0}

    insert_into_flow_table = PostgresOperator(
        task_id='insert_into_flow_table',
        postgres_conn_id='postgres_localhost',  # Connection ID from Airflow UI
        sql="""
            INSERT INTO Flow (FreeCashFlow,CapitalExpenditure,Year,Company)
            VALUES
                (74071000000.0,-44477000000.0,2021,'Microsoft'),
                (59475000000.0,-28107000000.0,2022,'Microsoft'),
                (65149000000.0,-23886000000.0,2023,'Microsoft'),
                (56118000000.0,-20622000000.0,2024,'Microsoft');
        """
    )



    # Define task dependencies


    task1 >> create_stacked_table >> create_ratio_table >> create_key_table >> create_curr_table >> create_noncurr_table >> create_flow_table  ##task2 >> insert_into_stacked_table >> insert_into_ratio_table >> insert_into_key_table >> insert_into_curr_table >> insert_into_noncurr_table >> insert_into_flow_table >> insert_into_flow_table >> insert_into_ratio_table
