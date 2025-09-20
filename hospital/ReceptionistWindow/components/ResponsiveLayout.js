import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { getResponsiveValue } from '../../../utils/responsive';

const ResponsiveLayout = ({ 
  children, 
  columns = 1, 
  spacing = 8, 
  style,
  ...props 
}) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const isSmallScreen = width < 375;
  
  const actualColumns = isTablet ? Math.min(columns * 2, 3) : columns;
  const actualSpacing = getResponsiveValue(spacing * 0.5, spacing, spacing * 1.5);

  const containerStyle = {
    flexDirection: actualColumns > 1 ? 'row' : 'column',
    flexWrap: actualColumns > 1 ? 'wrap' : 'nowrap',
    marginHorizontal: -actualSpacing / 2,
  };

  const itemStyle = {
    flex: actualColumns > 1 ? `0 0 ${100 / actualColumns}%` : 1,
    paddingHorizontal: actualSpacing / 2,
    paddingVertical: actualSpacing / 2,
  };

  return (
    <View style={[containerStyle, style]} {...props}>
      {React.Children.map(children, (child, index) => (
        <View key={index} style={itemStyle}>
          {child}
        </View>
      ))}
    </View>
  );
};

export default ResponsiveLayout;
