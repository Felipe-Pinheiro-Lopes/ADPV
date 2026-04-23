using Neo4j.Driver;
using Microsoft.Extensions.Configuration;

namespace API.Services;

public interface INeo4jService : IDisposable
{
    IDriver Driver { get; }
    Task<bool> TestConnection();
}

public class Neo4jService : INeo4jService
{
    private readonly IDriver _driver;
    
    public Neo4jService(IConfiguration configuration)
    {
        var uri = configuration["Neo4j:Uri"] ?? "bolt://localhost:7687";
        var username = configuration["Neo4j:Username"] ?? "neo4j";
        var password = configuration["Neo4j:Password"] ?? "admin123";
        
        _driver = GraphDatabase.Driver(uri, AuthTokens.Basic(username, password));
    }
    
    public IDriver Driver => _driver;
    
    public async Task<bool> TestConnection()
    {
        try
        {
            var session = _driver.AsyncSession();
            await session.RunAsync("RETURN 1");
            return true;
        }
        catch
        {
            return false;
        }
    }
    
    public void Dispose()
    {
        _driver?.Dispose();
    }
}
