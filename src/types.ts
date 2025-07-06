import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';

export interface Discovery {
  objectName: string;
  learningData: {
      stem: { title: string; text: string; };
      tech: { title: string; text: string; };
      local: { title: string; text: string; };
  };
  date: string;
}

export type ModalScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CameraModal'>;