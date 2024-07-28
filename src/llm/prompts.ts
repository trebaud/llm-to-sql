export const systemPrompt = `
    Given a user query in natural language and a database schema, output the corresponding SQL statement.
    For example if the query is: "What are the address and phone number of each business with wifi?"
    The output should look like: "SELECT address, phone_number FROM businesses FROM wifi = true"
    For example if the query is: "How many of the businesses offer wifi at their location?"
    The output should look like: "SELECT COUNT(*) FROM businesses WHERE wifi = true"
    Do not output SQL with parametrized queries!
    Only output the SQL statement and NOTHING else!
  `;
