// Color Palette Configuration
export const colors = {
    // Background Colors
    background: '#0D1B2A',
    backgroundSecondary: '#1A2332',
    backgroundTertiary: '#2A3441',
    
    // Text Colors
    textPrimary: '#FFFFFF',
    textSecondary: '#E0E0E0',
    textMuted: '#9CA3AF',
    
    // Brand Colors
    primary: '#3A86FF',
    primaryHover: '#265DF2',
    accent: '#00D09C',
    accentHover: '#00B894',
    warning: '#FDCB6E',
    error: '#FF6B6B',
    
    // Status Colors
    success: '#00D09C',
    warning: '#FDCB6E',
    error: '#FF6B6B',
    info: '#3A86FF',
    
    // Border Colors
    border: '#3A86FF/20',
    borderSecondary: '#2A3441',
};

// Status color mapping
export const statusColors = {
    active: colors.success,
    halted: colors.warning,
    userStopped: colors.error,
    default: '#6B7280',
};

// Helper function to get status configuration
export const getStatusConfig = (status) => {
    const color = statusColors[status] || statusColors.default;
    const labels = {
        active: 'Active',
        halted: 'Halted',
        userStopped: 'User Stopped',
    };
    
    return {
        color,
        label: labels[status] || status,
        bgColor: `${color}20`,
    };
};
