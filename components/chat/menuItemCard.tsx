// FILE: src/components/MenuItemCard.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MenuItem } from '../../types/menu';
import { THEME } from '../../screens/theme';

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  onUploadImage: (id: string) => void;
  isUploading?: boolean;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onEdit,
  onDelete,
  onUploadImage,
  isUploading = false,
}) => {
  return (
    <View style={styles.card}>
      {/* Image Area */}
      <TouchableOpacity
        style={styles.imageWrapper}
        onPress={() => onUploadImage(item?.id)}
        disabled={isUploading}
      >
        {item.imageUrl ? (
          <Image source={{ uri: item?.imageUrl }} style={styles.cardImage} />
        ) : (
          <View style={styles.cardImagePlaceholder}>
            <MaterialCommunityIcons
              name="camera-plus-outline"
              size={28}
              color={THEME.MEDIUM_GRAY}
            />
          </View>
        )}

        {isUploading && (
          <View style={styles.imageLoadingOverlay}>
            <ActivityIndicator size="small" color={THEME.VIBRANT_RED} />
          </View>
        )}
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.cardContent}>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{item?.name}</Text>
          <Text style={styles.cardPrice}>
            N{parseFloat(item?.price?.toString() || '0').toFixed(2)}
          </Text>
        </View>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item?.description}
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.cardActions}>
        <TouchableOpacity onPress={() => onDelete(item.id)}>
          <Icon name="delete-outline" size={24} color={THEME.VIBRANT_RED} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onEdit(item)}
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>Edit Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.CARD_BACKGROUND,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#B0B0B0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  imageWrapper: {
    position: 'relative',
  },
  cardImage: {
    width: 70,
    height: 70,
    borderRadius: 16,
    backgroundColor: THEME.LIGHT_GRAY,
  },
  cardImagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 16,
    backgroundColor: THEME.LIGHT_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
  },
  cardTextContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.DARK_CHARCOAL,
    flex: 1,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.DARK_CHARCOAL,
    marginLeft: 1,
  },
  cardDescription: {
    fontSize: 14,
    color: THEME.MEDIUM_GRAY,
    lineHeight: 20,
  },
  cardActions: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 16,
    minHeight: 60,
  },
  editButton: {
    backgroundColor: `${THEME.VIBRANT_RED}20`,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 15,
    marginTop: 10,
  },
  editButtonText: {
    color: THEME.VIBRANT_RED,
    fontWeight: 'bold',
    fontSize: 12,
  },
});