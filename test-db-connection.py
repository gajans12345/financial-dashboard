#!/usr/bin/env python3
import psycopg2
import json

def test_database_connection():
    print("🔍 Testing PostgreSQL Database Connection...")
    print("=" * 50)
    
    try:
        # Try to connect to the database
        print("📡 Attempting to connect to PostgreSQL...")
        print("   Host: localhost")
        print("   Port: 5433")
        print("   Database: airflow")
        print("   User: airflow")
        
        conn = psycopg2.connect(
            host="localhost",
            port="5433",
            database="airflow",
            user="airflow",
            password="airflow"
        )
        
        print("✅ Database connection successful!")
        print()
        
        cur = conn.cursor()
        
        # Get all tables
        print("📊 Checking tables...")
        cur.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        """)
        tables = cur.fetchall()
        
        if not tables:
            print("❌ No tables found in the database!")
            print("   You need to run the DAG to create tables and insert data.")
            return
        
        print(f"✅ Found {len(tables)} tables:")
        for table in tables:
            table_name = table[0]
            print(f"   - {table_name}")
        
        print()
        
        # Check each table for data
        for table in tables:
            table_name = table[0]
            cur.execute(f"SELECT COUNT(*) FROM {table_name}")
            count = cur.fetchone()[0]
            print(f"📋 {table_name}: {count} rows")
            
            # Show sample data for key tables
            if table_name.lower() in ['keyy', 'ratio', 'curr'] and count > 0:
                cur.execute(f"SELECT * FROM {table_name} LIMIT 2")
                data = cur.fetchall()
                print(f"   Sample data: {data}")
        
        print()
        print("🎯 Key findings:")
        
        # Check specifically for the companies we need
        keyy_count = 0
        try:
            cur.execute("SELECT COUNT(*) FROM keyy")
            keyy_count = cur.fetchone()[0]
        except:
            pass
            
        if keyy_count > 0:
            print(f"✅ Keyy table has {keyy_count} companies")
            cur.execute("SELECT company FROM keyy")
            companies = [row[0] for row in cur.fetchall()]
            print(f"   Companies: {companies}")
        else:
            print("❌ Keyy table is empty - no company data found")
        
        cur.close()
        conn.close()
        
        print()
        print("🚀 Database is ready! Your Flask app should work now.")
        
    except psycopg2.OperationalError as e:
        print("❌ Database connection failed!")
        print(f"Error: {e}")
        print()
        print("🔧 Possible solutions:")
        print("   1. PostgreSQL is not running")
        print("   2. Database 'airflow' doesn't exist")
        print("   3. User 'airflow' doesn't exist")
        print("   4. Wrong port (trying 5433)")
        print()
        print("💡 Try running your Airflow DAG to set up the database")
        
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    test_database_connection()
