export const mockProjects = [
  {
    id: '1',
    name: 'E-commerce Website Redesign',
    description: 'Modernize the existing e-commerce platform with improved UX and mobile responsiveness',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Create a cross-platform mobile application for task management',
    createdAt: '2024-01-20T14:30:00Z'
  },
  {
    id: '3',
    name: 'Data Analytics Dashboard',
    description: 'Build a comprehensive dashboard for business intelligence and reporting',
    createdAt: '2024-02-01T09:15:00Z'
  },
  {
    id: '4',
    name: 'API Integration Project',
    description: 'Integrate third-party APIs for payment processing and shipping',
    createdAt: '2024-02-10T16:45:00Z'
  }
];

export const mockTasks = [
  // E-commerce Website Redesign tasks
  {
    id: '1',
    projectId: '1',
    description: 'Conduct user research and create personas',
    assignee: 'Sarah Johnson',
    dueDate: '2024-01-25',
    status: 'done',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    projectId: '1',
    description: 'Design wireframes and mockups',
    assignee: 'Mike Chen',
    dueDate: '2024-02-01',
    status: 'done',
    createdAt: '2024-01-16T11:00:00Z'
  },
  {
    id: '3',
    projectId: '1',
    description: 'Implement responsive navigation',
    assignee: 'Alex Rodriguez',
    dueDate: '2024-02-15',
    status: 'in-progress',
    createdAt: '2024-01-18T13:00:00Z'
  },
  {
    id: '4',
    projectId: '1',
    description: 'Optimize checkout process',
    assignee: 'Lisa Wang',
    dueDate: '2024-02-28',
    status: 'todo',
    createdAt: '2024-01-20T15:00:00Z'
  },
  {
    id: '5',
    projectId: '1',
    description: 'Perform cross-browser testing',
    assignee: 'David Kim',
    dueDate: '2024-03-05',
    status: 'todo',
    createdAt: '2024-01-22T16:00:00Z'
  },

  // Mobile App Development tasks
  {
    id: '6',
    projectId: '2',
    description: 'Set up React Native development environment',
    assignee: 'Emma Thompson',
    dueDate: '2024-01-25',
    status: 'done',
    createdAt: '2024-01-20T14:30:00Z'
  },
  {
    id: '7',
    projectId: '2',
    description: 'Create app navigation structure',
    assignee: 'Emma Thompson',
    dueDate: '2024-02-05',
    status: 'in-progress',
    createdAt: '2024-01-21T10:00:00Z'
  },
  {
    id: '8',
    projectId: '2',
    description: 'Implement user authentication',
    assignee: 'James Wilson',
    dueDate: '2024-02-20',
    status: 'todo',
    createdAt: '2024-01-23T11:00:00Z'
  },
  {
    id: '9',
    projectId: '2',
    description: 'Design and implement task CRUD operations',
    assignee: 'Emma Thompson',
    dueDate: '2024-03-01',
    status: 'todo',
    createdAt: '2024-01-25T14:00:00Z'
  },

  // Data Analytics Dashboard tasks
  {
    id: '10',
    projectId: '3',
    description: 'Define dashboard requirements and KPIs',
    assignee: 'Rachel Green',
    dueDate: '2024-02-05',
    status: 'done',
    createdAt: '2024-02-01T09:15:00Z'
  },
  {
    id: '11',
    projectId: '3',
    description: 'Design database schema',
    assignee: 'Tom Anderson',
    dueDate: '2024-02-15',
    status: 'in-progress',
    createdAt: '2024-02-02T10:00:00Z'
  },
  {
    id: '12',
    projectId: '3',
    description: 'Create data visualization components',
    assignee: 'Rachel Green',
    dueDate: '2024-02-25',
    status: 'todo',
    createdAt: '2024-02-05T11:00:00Z'
  },
  {
    id: '13',
    projectId: '3',
    description: 'Implement real-time data updates',
    assignee: 'Tom Anderson',
    dueDate: '2024-03-10',
    status: 'todo',
    createdAt: '2024-02-08T12:00:00Z'
  },

  // API Integration Project tasks
  {
    id: '14',
    projectId: '4',
    description: 'Research payment gateway APIs',
    assignee: 'Chris Martinez',
    dueDate: '2024-02-15',
    status: 'done',
    createdAt: '2024-02-10T16:45:00Z'
  },
  {
    id: '15',
    projectId: '4',
    description: 'Design API integration architecture',
    assignee: 'Chris Martinez',
    dueDate: '2024-02-25',
    status: 'in-progress',
    createdAt: '2024-02-12T09:00:00Z'
  },
  {
    id: '16',
    projectId: '4',
    description: 'Implement payment processing integration',
    assignee: 'Nina Patel',
    dueDate: '2024-03-15',
    status: 'todo',
    createdAt: '2024-02-14T10:00:00Z'
  },
  {
    id: '17',
    projectId: '4',
    description: 'Set up shipping API integration',
    assignee: 'Nina Patel',
    dueDate: '2024-03-20',
    status: 'todo',
    createdAt: '2024-02-16T11:00:00Z'
  }
];
