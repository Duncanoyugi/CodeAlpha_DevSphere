import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUpdateProfile } from '../hooks/useProfile'
import { useUploadAvatar } from '../hooks/useProfile'
import { Button } from '../../../components/ui/button'
import { Label } from '../../../components/ui/label'
import { Input } from '../../../components/ui/input'
import { Textarea } from '../../../components/ui/textarea'
import { ImageUpload } from '../../../components/common/ImageUpload'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select'
import { profileSchema, type ProfileInput } from '../../../lib/validators'
import { EXPERIENCE_LEVELS } from '../../../lib/constants'
import { useState } from 'react'
import { Avatar } from '../../../components/Avatar'
import { X } from 'lucide-react'

interface EditProfileProps {
  onSuccess?: () => void
  defaultValues?: {
    bio?: string
    experience?: string
    avatar?: string
    githubUrl?: string
    linkedInUrl?: string
    portfolioUrl?: string
  }
}

export function EditProfile({ onSuccess, defaultValues }: EditProfileProps) {
  const updateProfile = useUpdateProfile()
  const uploadAvatar = useUploadAvatar()
  const [avatarPreview, setAvatarPreview] = useState<string | null>(defaultValues?.avatar || null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: defaultValues || { bio: '', experience: 'Junior', githubUrl: '', linkedInUrl: '', portfolioUrl: '', avatar: '' },
  })

  const experience = watch('experience')

  const handleAvatarUpload = async (file: File) => {
    try {
      const result = await uploadAvatar.mutateAsync(file)
      setAvatarPreview(result.avatarUrl)
      setValue('avatar', result.avatarUrl, { shouldDirty: true })
    } catch {
      // error handled by toast in hook
    }
  }

  const removeAvatar = () => {
    setAvatarPreview(null)
    setValue('avatar', '', { shouldDirty: true })
  }

  const onSubmit = (data: ProfileInput) => {
    updateProfile.mutate(data, {
      onSuccess: () => {
        if (onSuccess) onSuccess()
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label>Profile Picture</Label>
        <div className="flex items-center gap-4">
          <Avatar name="User" src={avatarPreview} size="xl" />
          <div className="flex-1">
            <ImageUpload
              onUpload={handleAvatarUpload}
              accept="image/*"
              maxSize={5}
              className="h-24"
            />
            {avatarPreview && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-2 text-[var(--destructive)] hover:text-[var(--destructive)]"
                onClick={removeAvatar}
              >
                <X className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                Remove
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell us about yourself..."
          className="min-h-[120px]"
          {...register('bio')}
        />
        {errors.bio && (
          <p className="text-sm text-[var(--destructive)]">{errors.bio.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience">Experience Level</Label>
        <Select
          value={experience || ''}
          onValueChange={(value: string) => setValue('experience', value)}
        >
          <SelectTrigger id="experience">
            <SelectValue placeholder="Select experience level" />
          </SelectTrigger>
          <SelectContent>
            {EXPERIENCE_LEVELS.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.experience && (
          <p className="text-sm text-[var(--destructive)]">{errors.experience.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="githubUrl">GitHub</Label>
          <Input
            id="githubUrl"
            type="url"
            placeholder="https://github.com/you"
            {...register('githubUrl')}
          />
          {errors.githubUrl && (
            <p className="text-sm text-[var(--destructive)]">{errors.githubUrl.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedInUrl">LinkedIn</Label>
          <Input
            id="linkedInUrl"
            type="url"
            placeholder="https://linkedin.com/in/you"
            {...register('linkedInUrl')}
          />
          {errors.linkedInUrl && (
            <p className="text-sm text-[var(--destructive)]">{errors.linkedInUrl.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="portfolioUrl">Portfolio</Label>
          <Input
            id="portfolioUrl"
            type="url"
            placeholder="https://your-site.dev"
            {...register('portfolioUrl')}
          />
          {errors.portfolioUrl && (
            <p className="text-sm text-[var(--destructive)]">{errors.portfolioUrl.message}</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full rounded-xl"
        disabled={updateProfile.isPending || uploadAvatar.isPending}
      >
        {(updateProfile.isPending || uploadAvatar.isPending) ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  )
}
