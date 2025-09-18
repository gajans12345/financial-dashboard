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
               
                (71.061, 2014, 'Pepsico'),
                (74.952, 2015, 'Pepsico'),
                (81.53, 2016, 'Pepsico'),
                (91.399, 2017, 'Pepsico'),
                (92.251, 2018, 'Pepsico'),
                (110.09, 2019, 'Pepsico'),
                (120.637, 2020, 'Pepsico'),
                (137.18, 2021, 'Pepsico'),
                (160.91, 2022, 'Pepsico'),
                (170.46, 2023, 'Pepsico'),
                (168.93, 2024, 'Pepsico'),
                (272.33, 2014, 'BlackRock'),
                (281.99, 2015, 'BlackRock'),
                (349.96, 2016, 'BlackRock'),
                (415.73, 2017, 'BlackRock'),
                (389.42, 2018, 'BlackRock'),
                (499.60, 2019, 'BlackRock'),
                (773.49, 2020, 'BlackRock'),
                (643.11, 2021, 'BlackRock'),
                (666.24, 2022, 'BlackRock'),
                (856.88, 2023, 'BlackRock'),
                (1019.1, 2024, 'BlackRock');

        """
    )

    insert_into_stacked_table = PostgresOperator(
        task_id='insert_into_stacked_table',
        postgres_conn_id='postgres_localhost',  # Connection ID from Airflow UI
        sql="""
            INSERT INTO Stacked (CostofRevenue,Year, OperatingExpense, ResearchandDevelopment, SGA, Company)
            VALUES
               
                
                (31798000000.0, 2021, 28453000000.0, 117000000.0 , 28453000000.0, 'Pepsico'),
                (37076000000.0, 2022, 31237000000.0, 522000000.0, 31237000000.0, 'Pepsico'),
                (40576000000.0, 2023, 34459000000.0, 132000000.0 , 34459000000.0, 'Pepsico'),
                (41881000000.0, 2024, 36677000000.0, 250000000.0, 36677000000.0, 'Pepsico'),

                (7970000000.0, 2021, 1670000000.0, 354000000.0, 1564000000.0, 'BlackRock'),
                (9650000000.0, 2022, 9650000000.0, 803000000.0, 1821000000.0, 'BlackRock'),
                (9179000000.0, 2023, 1938000000.0, 7575000000.0, 1787000000.0, 'BlackRock'),
                (9236000000.0, 2024, 2014000000.0, 641000000.0, 1863000000.0, 'BlackRock');
        """
    )

    insert_into_ratio_table = PostgresOperator(
        task_id='insert_into_ratio_table',
        postgres_conn_id='postgres_localhost',  # Connection ID from Airflow UI
        sql="""
            INSERT INTO Ratio (PayoutRatio, ForwardPE, TrailingPE, ShortRatio, QuickRatio, CurrentRatio, PegRatio, Company)
            VALUES
                
                (0.7729, 17.3818, 22.07227, 3.46, 0.664, 0.886, 1.7805, 'Pepsico'),
                (0.501, 21.083, 25.187, 2.17, 1.889, 2.559, 1.7735, 'BlackRock');
        """
    )
 like

    insert_into_key_table = PostgresOperator(
        task_id='insert_into_key_table',
        postgres_conn_id='postgres_localhost',  # Connection ID from Airflow UI
        sql="""
            INSERT INTO Keyy (CurrentPrice, DividendRate, BidAskSpread, FiftyTwoWeekHigh, FiftyTwoWeekLow, MarketCap, ROE, PegRatio, Company)
            VALUES
                
                (145.4, 5.42, 0.24, 183.41, 145.34, 199487340544, 0.48819, 1.7403, 'Pepsico'),
                (980.76, 20.4, 1.9500, 1082.45, 745.55, 151899144192, 0.1505, 1.7594, 'BlackRock');
        """
    )

    insert_into_curr_table = PostgresOperator(
        task_id='insert_into_curr_table',
        postgres_conn_id='postgres_localhost',  # Connection ID from Airflow UI
        sql="""
            INSERT INTO Curr (ShortTerm, Receivables, Inventory, HedgingAssetsCurrently, OtherCurrentAssets, Company)
            VALUES
                
                (37.1, 40.1, 0.8, 19.8, 3.0, 'Pepsico'),
                (35.6, 42.3, 0.9, 18.5, 3.5, 'BlackRock');
        """
    )

    insert_into_noncurr_table = PostgresOperator(
        task_id='insert_into_noncurr_table',
        postgres_conn_id='postgres_localhost',  # Connection ID from Airflow UI
        sql="""
            INSERT INTO NonCurr (PPE, Intangibles, Investments, OtherNonCurrentAssets, Company)
            VALUES
                
                (40.7, 44.4, 5.9, 9.0, 'Pepsico'),
                (38.5, 46.2, 6.3, 10.1, 'BlackRock');
        """
    )
    microsoft_cash1 = {' Free Cash Flow ': 74071000000.0, ' Capital Expenditure ': -44477000000.0}
    microsoft_cash2 = {' Free Cash Flow ': 59475000000.0, ' Capital Expenditure ': -28107000000.0}
    microsoft_cash3 = {' Free Cash Flow ': 65149000000.0, ' Capital Expenditure ': -23886000000.0}
    microsoft_cash4 = {' Free Cash Flow ': 56118000000.0, ' Capital Expenditure ': -20622000000.0}

    insert_into_flow_table = PostgresOperator(
    task_id='insert_into_flow_table',
    postgres_conn_id='postgres_localhost',
    sql="""
        INSERT INTO Flow (FreeCashFlow, CapitalExpenditure, Year, Company)
        VALUES
            (6373000000.0, 1156000000.0, 2020, 'PepsiCo'),
            (6991000000.0, 1184000000.0, 2021, 'PepsiCo'),
            (5604000000.0, 1043000000.0, 2022, 'PepsiCo'),
            (7924000000.0, 1401000000.0, 2023, 'PepsiCo'),
            (3549000000.0, 183000000.0, 2020, 'BlackRock'),
            (4603000000.0, 189000000.0, 2021, 'BlackRock'),
            (4423000000.0, 177000000.0, 2022, 'BlackRock'),
            (3821000000.0, 200000000.0, 2023, 'BlackRock');
    """
)



    # Define task dependencies


    task1 >> create_stacked_table >> create_ratio_table >> create_key_table >> create_curr_table >> create_noncurr_table >> create_flow_table  ##task2 >> insert_into_stacked_table >> insert_into_ratio_table >> insert_into_key_table >> insert_into_curr_table >> insert_into_noncurr_table >> insert_into_flow_table >> insert_into_flow_table >> insert_into_ratio_table
