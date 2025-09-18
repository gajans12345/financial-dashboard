import psycopg2

# Database connection settings
conn = psycopg2.connect(
    dbname="airflow",
    user="airflow",   # change to your user if needed
    password="airflow",  # change if different
    host="localhost",
    port="5432"
)

cur = conn.cursor()

# ---------- CREATE TABLES ----------
create_tables = [
    """
    CREATE TABLE IF NOT EXISTS Pricees (
        Price NUMERIC PRIMARY KEY,
        Year INT NOT NULL,
        Company VARCHAR(255) NOT NULL
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS Stacked (
        CostofRevenue NUMERIC PRIMARY KEY,
        Year VARCHAR(4) NOT NULL,
        OperatingExpense NUMERIC NOT NULL,
        ResearchandDevelopment NUMERIC NOT NULL,
        SGA NUMERIC NOT NULL,
        Company VARCHAR(255) NOT NULL
    );
    """,
    """
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
    """,
    """
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
    """,
    """
    CREATE TABLE IF NOT EXISTS Curr (
        ShortTerm DECIMAL PRIMARY KEY,
        Receivables DECIMAL NOT NULL,
        Inventory DECIMAL NOT NULL,
        HedgingAssetsCurrently DECIMAL NOT NULL,
        OtherCurrentAssets DECIMAL NOT NULL,
        Company VARCHAR(255) NOT NULL
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS NonCurr (
        PPE DECIMAL PRIMARY KEY,
        Intangibles DECIMAL NOT NULL,
        Investments DECIMAL NOT NULL,
        OtherNonCurrentAssets DECIMAL NOT NULL,
        Company VARCHAR(255) NOT NULL
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS Flow (
        FreeCashFlow NUMERIC(15,1) PRIMARY KEY,
        CapitalExpenditure NUMERIC(15,1) NOT NULL,
        Year VARCHAR(4) NOT NULL,
        Company VARCHAR(255) NOT NULL
    );
    """
]

for sql in create_tables:
    cur.execute(sql)

# ---------- INSERT DATA ----------
insert_statements = [
    # Prices table
    """
    INSERT INTO Pricees (Price, Year, Company) VALUES
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
        (417.528, 2024, 'Microsoft'),
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
        (1019.1, 2024, 'BlackRock')
    ON CONFLICT DO NOTHING;
    """,
    # Stacked table (missing comma fixed ✅)
    """
    INSERT INTO Stacked (CostofRevenue, Year, OperatingExpense, ResearchandDevelopment, SGA, Company) VALUES
        (52232000000.0, 2021, 5107000000.0, 7575000000.0, 171008000000.0, 'Microsoft'),
        (62650000000.0, 2022, 5900000000.0, 7575000000.0, 171008000000.0, 'Microsoft'),
        (65863000000.0, 2023, 7575000000.0, 7575000000.0, 171008000000.0, 'Microsoft'),
        (74114000000.0, 2024, 7609000000.0, 7609000000.0, 171008000000.0, 'Microsoft'),
        (31798000000.0, 2021, 28453000000.0, 117000000.0, 28453000000.0, 'Pepsico'),
        (37076000000.0, 2022, 31237000000.0, 522000000.0, 31237000000.0, 'Pepsico'),
        (40576000000.0, 2023, 34459000000.0, 132000000.0, 34459000000.0, 'Pepsico'),
        (41881000000.0, 2024, 36677000000.0, 250000000.0, 36677000000.0, 'Pepsico'),
        (7970000000.0, 2021, 1670000000.0, 354000000.0, 1564000000.0, 'BlackRock'),
        (9650000000.0, 2022, 9650000000.0, 803000000.0, 1821000000.0, 'BlackRock'),
        (9179000000.0, 2023, 1938000000.0, 7575000000.0, 1787000000.0, 'BlackRock'),
        (9236000000.0, 2024, 2014000000.0, 641000000.0, 1863000000.0, 'BlackRock')
    ON CONFLICT DO NOTHING;
    """,
    # Ratio table
    """
    INSERT INTO Ratio (PayoutRatio, ForwardPE, TrailingPE, ShortRatio, QuickRatio, CurrentRatio, PegRatio, Company) VALUES
        (0.2477, 28.430958, 35.37107, 3.28, 1.163, 1.301, 2.2141, 'Microsoft'),
        (0.7729, 17.3818, 22.07227, 3.46, 0.664, 0.886, 1.7805, 'Pepsico'),
        (0.501, 21.083, 25.187, 2.17, 1.889, 2.559, 1.7735, 'BlackRock')
    ON CONFLICT DO NOTHING;
    """,
    # Key table
    """
    INSERT INTO Keyy (CurrentPrice, DividendRate, BidAskSpread, FiftyTwoWeekHigh, FiftyTwoWeekLow, MarketCap, ROE, PegRatio, Company) VALUES
        (427.99, 3.32, 22.19999, 468.35, 362.9, 3182054342656, 0.35604, 2.2141, 'Microsoft'),
        (145.4, 5.42, 0.24, 183.41, 145.34, 199487340544, 0.48819, 1.7403, 'Pepsico'),
        (980.76, 20.4, 1.95, 1082.45, 745.55, 151899144192, 0.1505, 1.7594, 'BlackRock')
    ON CONFLICT DO NOTHING;
    """,
    # Curr table
    """
    INSERT INTO Curr (ShortTerm, Receivables, Inventory, HedgingAssetsCurrently, OtherCurrentAssets, Company) VALUES
        (47.3, 35.6, 0.8, 0.0075, 16.3, 'Microsoft'),
        (37.1, 40.1, 0.8, 19.8, 3.0, 'Pepsico'),
        (35.6, 42.3, 0.9, 18.5, 3.5, 'BlackRock')
    ON CONFLICT DO NOTHING;
    """,
    # NonCurr table
    """
    INSERT INTO NonCurr (PPE, Intangibles, Investments, OtherNonCurrentAssets, Company) VALUES
        (43.9, 41.7, 4.1, 10.3, 'Microsoft'),
        (40.7, 44.4, 5.9, 9.0, 'Pepsico'),
        (38.5, 46.2, 6.3, 10.1, 'BlackRock')
    ON CONFLICT DO NOTHING;
    """,
    # Flow table
    """
    INSERT INTO Flow (FreeCashFlow, CapitalExpenditure, Year, Company) VALUES
        (74071000000.0,-44477000000.0,2021,'Microsoft'),
        (59475000000.0,-28107000000.0,2022,'Microsoft'),
        (65149000000.0,-23886000000.0,2023,'Microsoft'),
        (56118000000.0,-20622000000.0,2024,'Microsoft'),
        (6373000000.0, 1156000000.0, 2020, 'PepsiCo'),
        (6991000000.0, 1184000000.0, 2021, 'PepsiCo'),
        (5604000000.0, 1043000000.0, 2022, 'PepsiCo'),
        (7924000000.0, 1401000000.0, 2023, 'PepsiCo'),
        (3549000000.0, 183000000.0, 2020, 'BlackRock'),
        (4603000000.0, 189000000.0, 2021, 'BlackRock'),
        (4423000000.0, 177000000.0, 2022, 'BlackRock'),
        (3821000000.0, 200000000.0, 2023, 'BlackRock')
    ON CONFLICT DO NOTHING;
    """
]

for sql in insert_statements:
    cur.execute(sql)

# Commit and close
conn.commit()
cur.close()
conn.close()

print("✅ Tables created and data inserted successfully.")