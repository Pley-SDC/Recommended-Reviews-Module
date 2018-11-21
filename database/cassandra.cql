CREATE KEYSPACE pley
  WITH REPLICATION = { 
   'class' : 'SimpleStrategy', 
   'replication_factor' : 3 
  };