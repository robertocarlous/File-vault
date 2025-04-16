import React from 'react';

interface SharedFile {
  id: string;
  name: string;
  sharedBy: string;
  sharedOn: string;
  access: 'read' | 'write';
}

const Shared: React.FC = () => {
  const sharedFiles: SharedFile[] = []; // This should be populated from your actual data source

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Shared Files</h1>
      
      {sharedFiles.length > 0 ? (
        <div className="bg-card rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Shared By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Shared On</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Access</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {sharedFiles.map((file) => (
                <tr key={file.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4 whitespace-nowrap">{file.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{file.sharedBy}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{file.sharedOn}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      file.access === 'write' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {file.access === 'write' ? 'Can Edit' : 'Can View'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No shared files to display</p>
        </div>
      )}
    </div>
  );
};

export default Shared;
