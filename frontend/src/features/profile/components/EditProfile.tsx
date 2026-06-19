import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUpdateProfile } from '../hooks/useProfile'
import { Button } from '../../../components/ui/button'
import { Label } from '../../../components/ui/label'
import { Input } from '../../../components/ui/input'
import { Textarea } from '../../../components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select'
import { profileSchema, type ProfileInput } from '../../../lib/validators'
import { EXPERIENCE_LEVELS } from '../../../lib/constants'

interface EditProfileProps {
  onSuccess?: () => void
  defaultValues?: {
    bio?: string
    experience?: string
    githubUrl?: string
    linkedInUrl?: string
    portfolioUrl?: string
  }
}

export function EditProfile({ onSuccess, defaultValues }: EditProfileProps) {
  const updateProfile = useUpdateProfile()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: defaultValues || { bio: '', experience: 'Junior', githubUrl: '', linkedInUrl: '', portfolioUrl: '' },
  })

  const experience = watch('experience')

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
        disabled={updateProfile.isPending}
      >
        {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  )
}
