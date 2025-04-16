import React from 'react';

interface RecentFile {
  id: string;
  name: string;
  type: string;
  lastModified: string;
  size: string;
}

const Recent: React.FC = () => {
  const recentFiles: RecentFile[] = []; // This should be populated from your actual data source

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Recent Files</h1>
      
      {recentFiles.length > 0 ? (
        <div className="bg-card rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Modified</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Size</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {recentFiles.map((file) => (
                <tr key={file.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4 whitespace-nowrap">{file.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{file.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{file.lastModified}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{file.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No recent files to display</p>
        </div>
      )}
    </div>
  );
};

export default Recent;
